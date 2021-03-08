#!/usr/bin/env bash

set -ex;

PACKAGE=$1
BASE_BRANCH=$2
MERGING_BRANCH=$3

if [ -z "$MERGING_BRANCH" ]; then
    echo "Usage: yarn transfer-branch [package] [base-branch] [merging-branch]";
    exit 1;
fi

case $PACKAGE in
"yoastseo")
    ORIGINAL_REPOSITORY=https://github.com/Yoast/YoastSEO.js.git
    ;;
"yoast-components")
    ORIGINAL_REPOSITORY=https://github.com/Yoast/yoast-components.git
    ;;
esac

if [ -z "$ORIGINAL_REPOSITORY" ]; then
    echo "Error: Unknown package";
    exit 1;
fi

echo $ORIGINAL_REPOSITORY;

git checkout $BASE_BRANCH
git checkout -b $MERGING_BRANCH

git subtree pull --prefix=packages/$PACKAGE $ORIGINAL_REPOSITORY $MERGING_BRANCH
