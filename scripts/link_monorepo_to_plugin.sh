#!/usr/bin/env bash

cd ..

# Clone the monorepo to the javascript directory in the parent folder
if [ -d javascript ]; then
  cd javascript
  git pull
else
  git clone https://github.com/Yoast/javascript.git
  cd javascript
fi

# Get the current branch name
CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2-)

if [ "$CURRENT_BRANCH" = "trunk" ]; then
	echo current branch is trunk
else
	echo current branch is bla
fi
