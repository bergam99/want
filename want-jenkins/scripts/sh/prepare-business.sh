#!/bin/bash
set -e

readonly ENV_FILE_PATH=$1
readonly SKIP_TEST=$2
readonly SONAR_TOKEN=$3

echo " > Copy tmp env file to ./want-back/src/main/resources/application-prod.properties"
cp $ENV_FILE_PATH ./want-back/src/main/resources/application-prod.properties

echo " > Execute goals (skip_test=${SKIP_TEST}) with maven:"
mvn -v
mvn -Dmaven.test.skip=$SKIP_TEST -Dtest=* -f ./want-back/pom.xml package jacoco:report sonar:sonar -Dsonar.token=$SONAR_TOKEN
