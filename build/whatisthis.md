What are these build files?
==========================

These files are just to help me set up my linux machine to develop this. It may be more helpful than my readme to look at my commands when I install rather than figure it out yourself.  Also, in the future I may start automating processes with tools like `bower` or `gulp` so I wanted a place to keep all that easy to configure for people

`Vagrantfile` is used by the program Vagrant - if you don't use that then you can ignore it.

`provision.sh` installs the things on the linux machine that I am using globally.  Right now it is just
 - `nodejs`
 - `mongodb` with default configuration
 - `n` the node version control thing so we can easily get the latest version.

`build.sh` compiles my changes to the brogue source and installs our npm dependencies.
