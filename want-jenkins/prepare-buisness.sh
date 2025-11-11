#!/bin/bash

set -e

readonly SCRIPT=$0
readonly ENV_FILE_PATH=$1

echo "> Execution ${SCRIPT}"

echo " > Preparing buisness artifacts with maven and java: "

echo " > Copy tmp env file to ./want-buisness/src/main/resources/application-prod.properties"
cp $ENV_FILE_PATH ./want-buisness/src/main/resources/application-prod.properties # copie source -> destination

mvn -v
mvn -Dmaven.test.skip=true -f ./want-buisness/pom.xml package

echo " > Copy tmp env file to ./want-buisness/.env.production"
cp $ENV_FILE_PATH ./want-presentation/.env.production