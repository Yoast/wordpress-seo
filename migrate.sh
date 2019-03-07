#!/usr/bin/env bash

git checkout master

# Add YoastSEO.js:
git subtree add --prefix=packages/yoastseo https://github.com/yoast/YoastSEO.js.git master

# Add yoast-components
git subtree add --prefix=packages/yoast-components https://github.com/yoast/yoast-components.git master


git checkout -b develop
git subtree pull --prefix=packages/yoastseo https://github.com/yoast/YoastSEO.js.git develop
git subtree pull --prefix=packages/yoast-components https://github.com/yoast/yoast-components.git develop


./node_modules/.bin/lerna bootstrap

