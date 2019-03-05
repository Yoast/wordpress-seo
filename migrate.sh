#!/usr/bin/env bash

# Add YoastSEO.js:
git subtree add --prefix=packages/yoastseo https://github.com/yoast/YoastSEO.js.git develop

# Add yoast-components
git subtree add --prefix=packages/yoast-components https://github.com/yoast/yoast-components.git develop

./node_modules/.bin/lerna bootstrap

