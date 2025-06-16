#!/bin/bash

IMAGE_NAME="ggolan14/klab-app"
TAG="latest"

echo "Building docker image..."
docker build -t ${IMAGE_NAME}:${TAG} .

if [ $? -ne 0 ]; then
  echo "Docker build failed"
  exit 1
fi

echo "Pushing docker image..."
docker push ${IMAGE_NAME}:${TAG}

if [ $? -ne 0 ]; then
  echo "Docker push failed"
  exit 1
fi

echo "Restarting Azure App Service..."
az webapp restart --name klab-app --resource-group facu-apps-rg

if [ $? -ne 0 ]; then
  echo "Azure restart failed"
  exit 1
fi

echo "Deployment completed successfully."
