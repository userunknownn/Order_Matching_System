#!/usr/bin/env bash

echo "Waiting for the backend setup finish";
sleep 25;

echo "Installing dependencies"
yarn;

echo "Start the application"
yarn start;

