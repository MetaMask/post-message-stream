#!/usr/bin/env bash

set -x
set -e
set -u
set -o pipefail

mkdir -p dist-test
rm -rf dist-test/*
browserify --standalone PostMessageStream ./dist/WebWorker/WebWorkerPostMessageStream.cjs > ./dist-test/WebWorkerPostMessageStream.js
browserify --standalone PostMessageStream ./dist/node-process/ProcessMessageStream.cjs > ./dist-test/ProcessMessageStream.js
browserify --im --node --standalone PostMessageStream ./dist/node-thread/ThreadMessageStream.cjs > ./dist-test/ThreadMessageStream.js
