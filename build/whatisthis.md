What are these build files?
==========================

These files are just to help me set up my linux machine to develop this. It may be more helpful than my readme to look at my commands when I install rather than figure it out yourself.  Also, in the future I may start automating processes with tools like `bower` or `gulp` so I wanted a place to keep all that easy to configure for people

`Vagrantfile` is used by the program Vagrant - if you don't use that then you can ignore it.  The vagrant box that I am using is ubuntu 14.04 trusty tahr.  If you don't use vagrant or a different distribution than ubuntu, the next scripts may not work for you.  Also, if you use Vagrant you probably want to place this file and `provision.sh` somewhere outside of this repo.

`provision.sh` installs the things on my ubuntu linux machine that I am using globally.  Right now it is just
 - `build-essential` which we will need to compile some node modules
 - `git`
 - `nodejs`
 - `mongodb` with default configuration
 - `n` a node package manager to install various versions of node.  Not necessary but it has been useful for developing this.

`build.sh` compiles my changes to the brogue source and installs our npm dependencies. After writing this you could probably just do it yourself.
