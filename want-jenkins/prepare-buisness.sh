#!/bin/bash

set -ex # Failure et arreter à l'erreur

# $0 = script meme
# declarer constant
readonly SCRIPT=$0
readonly ENV_FILE_PATH=$1

echo "> Execution ${SCRIPT}"

echo " > Preparing buisness artifacts with maven and java: "

# application-prod.properties
echo " > Copy tmp env file to ./toto-buisness/src/main/resources/application-prod.properties"
cp $ENV_FILE_PATH ./toto-buisness/src/main/resources/application-prod.properties # copie source -> destination

mvn -v
mvn -Dmaven.test.skip=true -f ./toto-buisness/pom.xml package

# application-prod.properties
echo " > Copy tmp env file to ./toto-buisness/.env.production"
cp $ENV_FILE_PATH ./toto-presentation/.env.production # copie source -> destination