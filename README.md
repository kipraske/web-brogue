Web Brogue
==========

A web server for playing the Brogue over the internet.  Brogue is a game for Mac OS X, Windows, and Linux by Brian Walker.  For more information go https://sites.google.com/site/broguegame/.  The server only can be run on a POSIX environment at the moment.

Build Instructions
-----------------------

### Step 1: Get Dependencies ###

Get the latest stable version of node.js and mongoDB.

### Step 2: Get node packages
Navigate to the server directory and run `npm install` to get the node dependencies

### Step 3: Build Brogue Executable ###

Because I am just dumping the data from brogue over to the node server, there are not any special dependencies for compiling brogue.  So you don't need SDL, tcod, or ncurses to get it to compile.  It should be as simple as `make web` in the brogue directory and it will place the executable in brogue/bin.

Starting the Server
----------------------------

Starting the server should be as simple as starting up mongoDB and starting the node process.  You will probably need root permissions to start both of these processes:

1. To start the mongodb daemon type `mongod`
2. To start our server type `node server/app.js` or jus `node server/` from the root directory

You will probably want to edit server/config.js to set the ports and the server secret.
Note that client/dataIO/socket.js also needs to have the websocket port that you have set hardcoded.

If everything is running correctly it should say "Server listening on port 80"

Upgrading Brogue
------------------------------

To upgrade brogue, grab the latest version of the brogue source code from https://sites.google.com/site/broguegame/ for linux and update the platform code to include the web changes.

* Add platform/web-platform.c
* Update platform.h to define webConsole
* Update platform/main.c to set the currentConsole to webConsole if we are compiling with web
* Update the makefile

There are a number of changes to the core brogue source as well, to add recording of highscores, fix some rendering bugs etc. Make a diff of the current brogue source against v1.5.3 and reapply the diff to the new brogue, fixing any conflicts.

Server Configuration
--------------------------------
Server global configuration variables are defined in server/config.js. You may need to adjust these depending on how your environment is set up.

In particular, if you change the port setting (port.HTTP = 8080) you must make the same change in client/dataIO/socket.js (window.location.hostname + ":8080").
