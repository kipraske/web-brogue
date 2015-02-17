Web Brogue
==========

A web server for playing the Brogue over the internet.  Brogue is a game for Mac OS X, Windows, and Linux by Brian Walker.  For more information go https://sites.google.com/site/broguegame/.  The server only can be run on a POSIX environment at the moment.

Build Instructions
-----------------------

###Step 1: Get Dependencies ###

Get the latest version of node.js and mongoDB.  Since node.js is still a bit unstable, I would recommend getting the package directly from their site rather than from the repositories

### Step 2: Get node packages
Navigate to the server directory and run `npm install` to get the node dependencies

### Step 3: Build Brogue Executable ###

Because I am just dumping the data from brogue over to the node server, there are not any special dependencies for compiling brogue.  So you don't need SDL, tcod, or ncurses to get it to compile.  It should be as simple as `make web` in the brogue directory and it will place the executable in brogue/bin.

Starting the Server
----------------------------

Starting the server should be as simple as starting up mongoDB and starting the node process.  You will probably need root permissions to start both of these processes:

1. To start the mongodb daemon type `mongod`
2. To start our server type `node server/app.js` or jus `node server/` from the root directory

If everything is running correctly it should say "Server listening on port 80"
