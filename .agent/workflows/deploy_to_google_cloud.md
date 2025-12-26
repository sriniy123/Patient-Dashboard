---
description: Deploy the Next.js application to Google Cloud Run
---

# Deploy to Google Cloud Run

This workflow guides you through deploying the application to Google Cloud Run.

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialized (`gcloud init`).
- A Google Cloud Project created and billing enabled.
- APIs enabled: Cloud Run API, Artifact Registry API.

## Workflow

1.  **Authenticate with Google Cloud**
    Ensure you are authenticated and target the correct project.
    ```bash
    gcloud auth login
    gcloud config set project [YOUR_PROJECT_ID]
    gcloud auth configure-docker
    ```

2.  **Set Environment Variables**
    Set your project ID and application name.
    ```bash
    export PROJECT_ID=$(gcloud config get-value project)
    export APP_NAME="patient-dashboard"
    export REGION="us-central1" # Or your preferred region
    ```

3.  **Build the Docker Image**
    Build the image locally.
    ```bash
    docker build -t gcr.io/$PROJECT_ID/$APP_NAME:latest .
    ```
    *Note: If you are on a Mac with Apple Silicon (M1/M2) and deploying to a Linux environment, you might need to use `--platform linux/amd64`.*

4.  **Push the Image to Container Registry**
    Push the built image to Google Container Registry (GCR) or Artifact Registry.
    ```bash
    docker push gcr.io/$PROJECT_ID/$APP_NAME:latest
    ```

5.  **Deploy to Cloud Run**
    Deploy the image to Cloud Run.
    ```bash
    gcloud run deploy $APP_NAME \
      --image gcr.io/$PROJECT_ID/$APP_NAME:latest \
      --platform managed \
      --region $REGION \
      --allow-unauthenticated
    ```

6.  **Verify Deployment**
    The `gcloud run deploy` command will output a Service URL. Access that URL in your browser to verify the deployment.
