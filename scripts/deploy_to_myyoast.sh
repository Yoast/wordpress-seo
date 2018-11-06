#!/bin/bash

#############################
## MyYoast upload script   ##
#############################
## arg 1: MyYoast name     ##
## arg 2: Local filename   ##
#############################

set -ex

if [ -z "$1" ]; then
    echo 'The first argument should be the MyYoast name.'
    exit 1
fi

if [ -z "$2" ]; then
    echo 'The second argument should be the local filename.'
    exit 1
fi

NAME=$1
FILE=$2

curl -X POST \
  https://my.yoast.com/api/Downloads/file/$NAME \
  -F "file=@${FILE};type=application/javascript" \
  -F secret=$SECRET \
  -F version=$TRAVIS_TAG
