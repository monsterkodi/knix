#!/usr/bin/env sh

# install the grunt and bower command line tools globally
npm install -g grunt-cli bower

# install the npm dependencies locally
npm install

# install the bower packages locally
bower install

# build the sources
grunt build
