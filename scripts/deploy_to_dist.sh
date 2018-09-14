#!/usr/bin/env bash

######################
## Deployment script #
######################
## arg 1: git tag   ##
## arg 2: repo-name ##
######################

set -ex

if [ -z "$1" ]; then
    echo 'The first argument should be the version you want to deploy to dist.'
    exit 1
fi

if [ -z "$2" ]; then
    echo 'The second argument should be the repo name.'
    exit 1
fi

# Repo to deploy to:
USER="Yoast-dist"
REPO=$2
REPO_URL="git@github.com:$USER/$REPO.git"

# Get the latest tag.
lastTag=$1
mainDir=$(pwd)

# Clone the dist repo.
rm -rf ./dist-repo
git clone ${REPO_URL} dist-repo --no-checkout -b master

# Copy the git folder with the entire history.
cp -r ./dist-repo/.git ./artifact-composer

# Navigate to the to be committed folder.
cd ./artifact-composer

# Commit the files.
git add -A
git commit -m "Release ${lastTag}"

# Tag the commit.
git tag ${lastTag}

# Push to master.
git push -u origin master --tags
