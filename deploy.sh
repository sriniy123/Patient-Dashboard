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

# Configure docker auth
echo "Configuring docker authentication..."
gcloud auth configure-docker --quiet

# 3. Build the Docker Image
echo "Building Docker image..."
# Check for M1/M2 Mac to ensure correct platform build
ARCH=$(uname -m)
PLATFORM_FLAG=""
if [[ "$ARCH" == "arm64" ]]; then
    echo "Detected Apple Silicon. Adding --platform linux/amd64..."
    PLATFORM_FLAG="--platform linux/amd64"
fi

docker build $PLATFORM_FLAG -t gcr.io/$PROJECT_ID/$APP_NAME:latest .

# 4. Push the Image to Container Registry
echo "Pushing image to GCR..."
docker push gcr.io/$PROJECT_ID/$APP_NAME:latest

# 5. Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $APP_NAME \
  --image gcr.io/$PROJECT_ID/$APP_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

echo "Deployment complete!"
