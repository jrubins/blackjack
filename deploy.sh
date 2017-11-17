#!/bin/bash

# Make sure a deploy target is specified.
if [ $# -eq 0 ]; then
  echo "Please supply a deploy target: staging, production"
  exit 1
fi

# Set our APP and API base URLs depending on the deploy target.
APP_BASE_URL=""
GA_PROPERTY=""
FACEBOOK_APP_ID=""
if [ $1 = 'production' ]; then
  APP_BASE_URL="https://www.acetenblackjack.com"
  FACEBOOK_APP_ID="205877129893516"
  GA_PROPERTY="UA-92969366-1"
else
  echo "Please run the deploy script with a valid target: staging, production. Received: $1"
  exit 1
fi

echo "********** USING DEPLOY TARGET **********"
echo "Deploy target: $1"
echo -e "\n"

# Set our environment variables. Note: The NODE_ENV variable ensures we're building our production assets.
export NODE_ENV="production"
export APP_BASE_URL=$APP_BASE_URL
export GA_PROPERTY=$GA_PROPERTY
export FACEBOOK_APP_ID=$FACEBOOK_APP_ID

echo "********** SET ENVIRONMENT VARIABLES **********"
echo "NODE_ENV=$NODE_ENV"
echo "APP_BASE_URL=$APP_BASE_URL"
echo "GA_PROPERTY=$GA_PROPERTY"
echo "FACEBOOK_APP_ID=$FACEBOOK_APP_ID"
echo -e "\n"

echo "********** SETTING FIREBASE PROJECT **********"
node_modules/firebase-tools/bin/firebase use $1
echo -e "\n"

echo "********** BUILDING ASSETS **********"
# Rebuild.
yarn build
echo -e "\n"

echo "********** DEPLOYING ASSETS **********"
# Deploy to Firebase.
node_modules/firebase-tools/bin/firebase deploy
echo -e "\n"
