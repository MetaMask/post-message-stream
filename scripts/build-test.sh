#!/usr/bin/env bash

set -x
set -e
set -u
set -o pipefail

mkdir -p dist-test
rm -rf dist-test/*
browserify --standalone PostMessageStream ./dist/WorkerPostMessageStream.js > ./dist-test/WorkerPostMessageStream.js
