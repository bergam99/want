#!/bin/bash
set -e

exit_code=0

readonly DEPLOY_DIR=$1
readonly DB_USR=$2
readonly DB_PWD=$3
readonly DB_NAME=$4
readonly DB_SCHEMA=$5

echo " > Replace artifacts in '${DEPLOY_DIR}' with './want-data/*'"
rm -rf ${DEPLOY_DIR}/*
cp -r ./want-data/* ${DEPLOY_DIR}

echo " > Connect to DB '${DB_NAME}' and execute commands from '${DEPLOY_DIR}/commands.psql'"
psql postgresql://$DB_USR:$DB_PWD@localhost:5432/$DB_NAME <<MULTILINE
\set ON_ERROR_STOP
SET search_path TO $DB_SCHEMA;

\i $DEPLOY_DIR/commands.psql

\q
MULTILINE

readonly PSQL_EXIT_CODE=$?

if [ $PSQL_EXIT_CODE -gt 0 ]; then
    exit_code=1
fi

echo " > psql exit code=${PSQL_EXIT_CODE}"

exit $exit_code
