#!/usr/bin/env bash

# Go to the root directory of the plugin
# cd ..

# Get the current branch of the plugin
CURRENT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2-)

# Clone the monorepo to the javascript directory in the root directory of the plugin
if [ -d javascript ]; then
  cd javascript
  git pull
else
  git clone https://github.com/Yoast/javascript.git
  cd javascript
fi

if [ "$CURRENT_BRANCH" = "trunk" ]; then
	echo current branch is trunk
else
	echo current branch is bla
fi

exit 0

# Run yarn link-all inside the monorepo
yarn link-all

# Get all the packages inside the yoastseo package.json that are scoped using @yoast
packages=($(cat packages/yoastseo/package.json | tr '"' '\n' | grep @yoast))

# Go back to the root directory of the plugin
cd ..

for package in ${packages[@]}
do
   yarn link $package
done
