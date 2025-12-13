#!/bin/bash
set -e
trap 'echo "Error occurred on line $LINENO"; exit 1' ERR

readonly ENV_FILE_PATH=$1

echo " > Preparing buisness artifacts with maven and java: "

# application-prod.properties
echo " > Copy tmp env file to ./want-back/src/main/resources/application-prod.properties"
cp $ENV_FILE_PATH ./want-back/src/main/resources/application-prod.properties # copie source -> destination

mvn -v
mvn -Dmaven.test.skip=true -f ./want-back/pom.xml package
