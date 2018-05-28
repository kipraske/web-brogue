Web Brogue
==========

A web server for playing the Brogue over the internet.  Brogue is a game for Mac OS X, Windows, and Linux by Brian Walker.  For more information go https://sites.google.com/site/broguegame/.  The server only can be run on a POSIX environment at the moment.

Build Instructions
-----------------------

### Step 1: Get Dependencies ###

Get the latest stable version of node.js and mongoDB.

### Step 2: Get node packages
Navigate to the `server` directory and run `npm install` to get the node dependencies

### Step 3: Build Brogue Executables ###
Brogue: `cd brogue` `make web`
gBrogue: `cd gBrogue` `make -f Makefile.linux web`

Starting the Server
----------------------------

Starting the server should be as simple as starting up mongoDB and starting the node process.

1. To start the mongodb daemon type `mongod`
2. To start the server type `npm start` in the `server` directory.

You will probably want to edit server/config.js to set the ports and the server secret.

If everything is running correctly it should say "Server listening on port XXXX"

Note that you might need root access if you are running on a privileged port (e.g. 80).

Upgrading Brogue
------------------------------

To upgrade brogue, grab the latest version of the brogue source code from https://sites.google.com/site/broguegame/ for linux and update the platform code to include the web changes.

* Add platform/web-platform.c
* Update platform.h to define webConsole
* Update platform/main.c to set the currentConsole to webConsole if we are compiling with web
* Update the makefile

There are a number of changes to the core brogue source as well, to add recording of highscores, fix some rendering bugs etc. Make a diff of the current brogue source against v1.5.3 and reapply the diff to the new brogue, fixing any conflicts.

Configuration
--------------------------------
Server global configuration variables are defined in server/config.js.
Client configuration variables are defined in client/config.js.

In particular, make sure to get the client and server to agree on the websocketPort.

Upgrade notes
--------------------------------

If you have been running an older version of the server and are upgrading to a version with variant support (from 03b2d80 onward) you need to patch the DB to add the correct variant to existing entries:

```
db.gamerecords.update({variant: { $exists: false }}, { $set: { variant: "BROGUEV174" } }, {multi: true})
```