#!/bin/bash

set -e

readonly SCRIPT=$0
readonly ENV_FILE_PATH=$1

echo "> Execution ${SCRIPT}"

echo " > Preparing presentation artifacts with node and npm: "

node -v
npm -v

echo " > Generate artifacts with npm: "

npm --prefix ./want-front/ install

# .env.production 
echo " > Copy tmp env file to ./want-front/.env.production"
cp $ENV_FILE_PATH ./want-front/.env.production # copie source -> destination

npm --prefix ./want-front/ run build
