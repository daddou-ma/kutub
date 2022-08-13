#!/bin/bash

# Go to Project
cd /home/circleci/kutub

# Stop Container
yarn stop:prod

# Reset 
git reset --hard

# pull from the branch
git pull origin main

# Stop Container
yarn start:prod