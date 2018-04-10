#!/usr/bin/env bash
# Repo to deploy to:
USER="Yoast-dist"
REPO="wordpress-seo"
REPO_URL="git@github.com:$USER/$REPO.git"
# Get the latest tag.
lastTag=$1
mainDir=$(pwd)
# Create a new git repos.
cd ./artifact
git init
git remote add origin ${REPO_URL}
# Commit the files.
git add -A
git commit -m "commit version tag ${lastTag} "
# Tag the commit.
git tag ${lastTag} $(git rev-parse HEAD)
# Force push to master.
git push -u origin master --tags -f -v
