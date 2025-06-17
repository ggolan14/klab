#!/bin/bash

# משתנים
IMAGE_NAME="ggolan14/klab-app"

# מייצר tag לפי הפורמט שביקשת: ddMMyyyy-HH_MM_SS
TAG=$(date +"%d%m%Y-%H_%M_%S")

echo "Building docker image with tag $TAG..."
docker build -t ${IMAGE_NAME}:${TAG} .

if [ $? -ne 0 ]; then
  echo "Docker build failed"
  exit 1
fi

echo "Pushing docker image with tag $TAG..."
docker push ${IMAGE_NAME}:${TAG}

if [ $? -ne 0 ]; then
  echo "Docker push failed"
  exit 1
fi

docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:latest

#restart App-Service klab-app with the relevant resource group
echo "Restarting Azure App Service..."
az webapp restart --name klab-app --resource-group facu-apps-rg

if [ $? -ne 0 ]; then
  echo "Azure restart failed"
  exit 1
fi

echo "Creating git tag $TAG..."
git tag $TAG

if [ $? -ne 0 ]; then
  echo "Git tag failed"
  exit 1
fi

echo "Pushing git tag $TAG to origin..."
git push origin $TAG

if [ $? -ne 0 ]; then
  echo "Git push failed"
  exit 1
fi

echo "Deployment and tagging completed successfully."
echo "Deployed version: ${TAG}"
