Data Use
========

It has come to my attention that the current brogue game uses a ridiculous amount of data.  I have plans in the future to implement a brogue-client to talk to the server which will reduce data transfer by orders of magnitude, but until then we will have to make sure we are not using *too* much data when we buy a hosting service.

In conclusion it looks like we should be safe to use 512MB for around 24 users.  More users can be used but then the data transfer hits the ridiculous mark (1TB).

Memory
------

Base Node Process: 46MB
Additional Node User Process : 1MB
Each Brogue Process : 8MB

So 50 users would consume - 496MB

We want less than that of course to account for the mongodb process and other linux processes.

Data Transfer
-------------

Now the fun part -

A page load sends about 50kb of data.  Pretty small in the grand scheme of things.

Refreshing the entire brogue console is 34kb

Playing pretty quickly it seems like a casual user hitting autoexplore can hit 1MB of transfer in a minute.  So here is the worse case scenario: How many of these users can we support at a time without going over the basic package 1TB/month limit.

Looks the the answer is about 24 users.  The good news is there likely won't be 24 users playing at a time.  crawl.akrasic.org has about 45 users logged in at the time of this writing.

