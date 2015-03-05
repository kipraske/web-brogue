#!bin/bas
# Compiles brogue and fetches npm dependencies

cd ../brogue
make brogue web
cd ../server
npm install
