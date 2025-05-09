#!/usr/bin/env bash
echo "Waiting for database startup";
sleep 35;

echo "Prisma orm setup";
yarn prisma generate;
yarn prisma migrate reset --force;

echo "Start the application"
yarn start:dev;

