#!/bin/bash

tar czf firstdrop.tar.gz public/ views/ package-lock.json package.json server.js 
scp firstdrop.tar.gz 46.101.22.91:~
rm firstdrop.tar.gz

ssh 46.101.22.91 << 'ENDSSH'
PM2 stop firstdrop
rm -rf firstdrop
mkdir firstdrop
tar xf firstdrop.tar.gz -C firstdrop
rm firstdrop.tar.gz
cd firstdrop
yarn install
pm2 start firstdrop
ENDSSH
