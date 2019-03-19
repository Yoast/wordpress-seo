#!/usr/bin/env bash

# Get the current branch of the plugin
CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2-)

# Clone the monorepo to the javascript directory in the root directory of the plugin
if [[ -d javascript ]]; then
  cd javascript
  git pull
else
  git clone https://github.com/Yoast/javascript.git
  cd javascript
fi

JS_BRANCH=${CURRENT_BRANCH}

if [[ "$CURRENT_BRANCH" = "trunk" ]]; then
	JS_BRANCH="develop"
fi

git checkout ${JS_BRANCH}
if [[ $? -ne 0 ]]; then
	echo -e "${CURRENT_BRANCH} does not exist\nFallback to develop"
	git checkout develop
	git pull
fi

# Just to be sure.
yarn install

# Run yarn link-all inside the monorepo.
yarn link-all

# Go back to the root directory of the plugin
cd ..

# Get all the packages inside the yoastseo package.json that are scoped using @yoast
packages=($(cat package.json | tr '"' '\n' | grep -w @yoast))

for package in ${packages[@]}
do
   echo -e "Linking ${package}\n"
   # We don't want to exit on errors since there are some packages that we simply can't link (yet).
   yarn link ${package} || true
done
