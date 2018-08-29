#!/usr/bin/env bash
######################
## Deployment script #
######################
## arg 1: git tag   ##
## arg 2: repo-name ##
######################
# Repo to deploy to:
USER="Yoast-dist"
REPO=$2
REPO_URL="git@github.com:$USER/$REPO.git"
# Get the latest tag.
lastTag=$1
mainDir=$(pwd)
# Clone the dist repo.
git clone ${REPO_URL} dist-repo --no-checkout
# Copy the git folder with the entire history.
cp -r ./dist-repo/.git ./artifact
# Navigate to the to be committed folder.
cd ./artifact
# Commit the files.
git add -A
git commit -m "commit version tag ${lastTag} "
# Tag the commit.
git tag ${lastTag} $(git rev-parse HEAD)
# Push to master.
git push -u origin master --tags -f -v
