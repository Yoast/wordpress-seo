#!/usr/bin/env bash

set -ex

rm -rf storybook-git-repo
git clone --no-checkout git@github.com:Yoast/ui-library-storybook.git storybook-git-repo
yarn build:storybook
cp -r storybook-git-repo/.git storybook-static
cd storybook-static
git add -A
git commit -m "Publish storybook"
git push origin master
