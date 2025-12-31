#!/bin/bash

# Deploy to Google Cloud Run
# Based on .agent/workflows/deploy_to_google_cloud.md

set -e # Exit immediately if a command exits with a non-zero status.

# Function to check for gcloud
check_gcloud() {
  if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud could not be found. Please install the Google Cloud SDK."
    # Check if it was installed in the local directory from previous step
    if [ -f "./google-cloud-sdk/bin/gcloud" ]; then
        echo "Found local gcloud installation. Adding to PATH..."
        export PATH=$PATH:$(pwd)/google-cloud-sdk/bin
    else
        exit 1
    fi
  fi
}

# 1. Authenticate with Google Cloud (Check if logged in)
check_gcloud

echo "Ensuring you are authenticated..."
# This might require interaction if not logged in, which is fine for a manual script run
# gcloud auth login --quiet # avoiding auto-login as it requires interaction usually handled outside script or assumes existing auth

# 2. Set Environment Variables
echo "Setting environment variables..."
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "Error: No project set. Run 'gcloud config set project [YOUR_PROJECT_ID]'"
    exit 1
fi

APP_NAME="patient-dashboard"
REGION="us-central1" # Or your preferred region

echo "Project ID: $PROJECT_ID"
echo "App Name: $APP_NAME"
echo "Region: $REGION"

# Enable Cloud Build and Artifact Registry APIs
echo "Enabling Cloud Build and Artifact Registry APIs..."
gcloud services enable cloudbuild.googleapis.com artifactregistry.googleapis.com

# 3. Create Artifact Registry Repository
REPO_NAME="patient-dashboard-repo"
echo "Ensuring Artifact Registry repository exists..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
    echo "Creating repository $REPO_NAME..."
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for Patient Dashboard"
else
    echo "Repository $REPO_NAME already exists."
fi

# 4. Build and Push the Image using Cloud Build
IMAGE_URL="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$APP_NAME:latest"
echo "Building and Pushing image to $IMAGE_URL using Cloud Build..."
gcloud builds submit --tag $IMAGE_URL .

# 5. Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME \
  --image $IMAGE_URL \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

echo "Deployment complete!"
