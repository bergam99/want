#!/bin/bash

set -e

readonly DEPLOY_DIR=$1
readonly PRESENTATION_URL=$2

echo "> Execution ${SCRIPT}"

echo " > Deploy dist/* to ${DEPLOY_DIR}"
rm -r $DEPLOY_DIR/* 
cp -r ./want-front/dist/* $DEPLOY_DIR

echo " > Deployed !!"
echo $PRESENTATION_URL