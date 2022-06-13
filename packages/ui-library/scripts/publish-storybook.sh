#!/usr/bin/env bash

set -ex

# Clean up previous Storybook GitHub Pages repo dir
rm -rf storybook-git-repo
# Clone Storybook GitHub Pages repo
git clone --no-checkout git@github.com:Yoast/ui-library-storybook.git storybook-git-repo
# Build our Storybook
yarn build:storybook
# Copy git folder from Storybook GitHub Pages dir -> static Storybook dir
cp -r storybook-git-repo/.git storybook-static
# Switch to static Storybook dir
cd storybook-static
# Add custom domain CNAME record
echo ui-library.yoast.com > CNAME
# Commit files and push to Storybook GitHub Pages repo
git add -A
git commit -m "Publish storybook"
git push origin master
