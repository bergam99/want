#!/bin/bash

# set -e

readonly SCRIPT=$0
readonly WANT_BUISNESS_DEPLOY_DIR=$1 # deposer .jar
readonly WANT_BUISNESS_URL=$2
readonly WANT_BUISNESS_PORT=$3

echo "> Execution ${SCRIPT}"

echo "> Stopping want-buisness (optional operation)"

# check if a process exists on port:
lsof -ti tcp:$WANT_BUISNESS_PORT #recuperer le port en variable au niveau propriete folder
readonly LSOF_EXIT_CODE=$?

# Stop if script execution failed
set -e # pas tout en haut si pid exists pas

# si ya seulement pas de process en cours alors demarre
if [ $LSOF_EXIT_CODE -eq 0 ]; then
    # Get PID (process id)
    readonly PID=$(lsof -ti tcp:$WANT_BUISNESS_PORT)
    echo "killing gracefully the process with PID=${PID}..."
    kill -15 $PID
    echo " > Process killed"
else
    echo " > process isn't running"
fi


echo " > Deploy target/*.jar to ${WANT_BUISNESS_DEPLOY_DIR}"
rm -rf $WANT_BUISNESS_DEPLOY_DIR/* # supprimer dans le folder l'ancien build
cp ./want-buisness/target/*.jar $WANT_BUISNESS_DEPLOY_DIR/want-buisness.jar # sur ecrire (les artifacts de build dans dist -> copy deploy directory)

JENKINS_NODE_COOKIE=dontKillMe nohup java -jar -Dspring.profiles.active=prod $WANT_BUISNESS_DEPLOY_DIR/want-buisness.jar &

echo " > Deployed !!"
echo $WANT_BUISNESS_URL

