#!/bin/bash
source $HOME/.nvm/nvm.sh
nvm use v12
cd templates/form_denuncias
yarn build
