#!/bin/sh

echo "Deploying!"

yarn install
grunt artifact
ls
