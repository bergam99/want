#!/bin/bash

set -e

readonly SCRIPT=$0
readonly WANT_PRESENTATION_DEPLOY_DIR=$1
readonly WANT_PRESENTATION_URL=$2

echo "> Execution ${SCRIPT}"

echo " > Deploy dist/* to ${WANT_PRESENTATION_DEPLOY_DIR}"
rm -r $WANT_PRESENTATION_DEPLOY_DIR/* 
cp -r ./want-front/dist/* $WANT_PRESENTATION_DEPLOY_DIR

echo " > Deployed !!"
echo $WANT_PRESENTATION_URL