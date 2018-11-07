#!/bin/bash

############################
## My Yoast upload script ##
############################
## arg 1: My Yoast name   ##
## arg 2: Filename        ##
## arg 3: Version         ##
############################

set -ex

if [ -z "$1" ]; then
    echo 'The first argument should be the MyYoast name.'
    exit 1
fi

if [ -z "$2" ]; then
    echo 'The second argument should be the local filename.'
    exit 1
fi

if [ -z "$3" ]; then
    echo 'The third argument should be the version.'
    exit 1
fi

NAME=$1
FILE=$2
VERSION=$3

curl -X POST \
  https://my.yoast.com/api/Downloads/file/$NAME \
  -F "file=@${FILE};type=application/javascript" \
  -F secret=$SECRET \
  -F version=$VERSION
