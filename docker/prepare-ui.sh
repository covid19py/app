#!/bin/bash
source $HOME/.nvm/nvm.sh
nvm use v12
npm install
yarn build
