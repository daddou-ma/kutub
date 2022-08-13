#!/bin/bash

# Go to Project
cd /home/circleci/kutub

# Stop Container
yarn stop:prod

# Reset 
git reset --hard

# pull from the branch
GIT_SSH_COMMAND='ssh -i /home/circleci/.ssh/id_rsa_git -o IdentitiesOnly=yes' git pull origin main

# Stop Container
yarn start:prod