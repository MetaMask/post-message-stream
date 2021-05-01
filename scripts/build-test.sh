#!/usr/bin/env bash

set -x
set -e
set -u
set -o pipefail

mkdir -p dist-test
rm dist-test/*.js
browserify --standalone PostMessageStream ./dist/WorkerPostMessageStream.js > ./dist-test/WorkerPostMessageStream.js
browserify --standalone PostMessageStream ./dist/WindowPostMessageStream.js > ./dist-test/WindowPostMessageStream.js
