#!/usr/bin/env bash

# Check to make sure that we get the correct branch if this is being run in TravisCI.
if [[ ${CI} = "1" ]]; then
    if [[ ${TRAVIS_PULL_REQUEST_BRANCH} = "" ]]; then
        CURRENT_BRANCH=${TRAVIS_BRANCH}
    else
        CURRENT_BRANCH=${TRAVIS_PULL_REQUEST_BRANCH}
    fi
else
    # Get the current branch of the plugin
    CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2-)
fi

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

# Try to checkout the right branch with a fallback to develop.
git checkout ${JS_BRANCH}
if [[ $? -ne 0 ]]; then
	echo -e "${CURRENT_BRANCH} does not exist\nFallback to develop"
	git checkout develop
fi

git pull

# Just to be sure.
yarn install

# Run yarn link-all inside the monorepo.
yarn link-all

# Go back to the root directory of the plugin
cd ..

# Get all the packages inside the yoastseo package.json that are scoped using @yoast
packages=($(ls javascript/packages))

for package in ${packages[@]}
do
   echo -e "Linking @yoast/${package}\n"
   # We don't want to exit on errors since there are some packages that we simply can't link (yet).
   yarn link @yoast/${package} || true
done

# Manually link yoast-components and yoastseo because they don't adhere to the new naming conventions (yet).
yarn link yoast-components
yarn link yoastseo
