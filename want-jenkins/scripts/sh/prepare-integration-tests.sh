#!/bin/bash
set -e

readonly TEST_ENV_FILE_PATH=$1
readonly DB_USR=$2
readonly DB_PWD=$3
readonly DB_NAME=$4
readonly DB_SCHEMA=$5

echo " > Copy tmp test env file to ./want-back/src/test/resources/application-test.properties"
cp $TEST_ENV_FILE_PATH ./want-back/src/test/resources/application-test.properties

echo " > Connect to DB '${DB_NAME}' and execute commands from './want-data/commands-test.psql'"
export PGPASSWORD="${DB_PWD}"
psql "postgresql://${DB_USR}@localhost:5432/${DB_NAME}" <<MULTILINE
\set ON_ERROR_STOP
SET search_path TO $DB_SCHEMA;

\i './want-data/commands-test.psql'

\q
MULTILINE
readonly PSQL_EXIT_CODE=$?
unset PGPASSWORD

if [ $PSQL_EXIT_CODE -gt 0 ]; then
    exit_code=1
fi

echo " > psql exit code=${PSQL_EXIT_CODE}"

exit $exit_code