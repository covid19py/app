#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source $HOME/.nvm/nvm.sh
nvm install v12
nvm use v12
npm install -g yarn
cd templates/form_denuncias
yarn
