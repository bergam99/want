#!/bin/bash

readonly DEPLOY_DIR=$1 # deposer dans .jar
readonly URL=$2
readonly BUSINESS_PORT=$3

echo " > Stop toto-business (optional operation)"

# Check if a process exists on port:
lsof -ti tcp:$BUSINESS_PORT
readonly LSOF_EXIT_CODE=$?

# Flag to stop script execution:
set -e

# si ya seulement pas de process en cours alors demarre
if [ $LSOF_EXIT_CODE -eq 0 ]; then
    # Get PID (process id)
    readonly PID=$(lsof -ti tcp:$BUSINESS_PORT)
    echo " > Kill gracefully process with PID=${PID}..."
    kill -15 $PID
    echo " > Process killed"
else
    echo " > No process running"
fi

echo " > Deploy target/*.jar to ${DEPLOY_DIR}"
rm -rf $DEPLOY_DIR/* # supprimer dans le folder l'ancien build
cp ./want-back/target/*.jar $DEPLOY_DIR/want-back.jar # sur ecrire (les artifacts de build dans dist -> copy deploy directory)

# nohup: no hang up
JENKINS_NODE_COOKIE=dontKillMe nohup java -jar -Dspring.profiles.active=prod $DEPLOY_DIR/want-back.jar &

echo " > Deployed! Have a look, enjoy your work: ${URL}"
