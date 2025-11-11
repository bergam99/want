#!/bin/bash

set -e

readonly SCRIPT=$0
readonly ENV_FILE_PATH=$1

echo "> Execution ${SCRIPT}"

echo " > Preparing buisness artifacts with maven and java: "

echo " > Copy tmp env file to ./want-back/src/main/resources/application-prod.properties"
cp $ENV_FILE_PATH ./want-back/src/main/resources/application-prod.properties # copie source -> destination

mvn -v
mvn -Dmaven.test.skip=true -f ./want-back/pom.xml package

echo " > Copy tmp env file to ./want-back/.env.production"
cp $ENV_FILE_PATH ./want-back/.env.production