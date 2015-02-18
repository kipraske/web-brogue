Platform Notes
=========================

I mention that this only works on a POSIX environment at the moment and wanted to explain why.  The plan for this server was to use node.js and simply use the stdin and stdout of the brogue process to do very rudimentary i/o between the server and the child process.  I was originally doing my development on a windows platform and started running into problems with multi-turn travel - the io would block whenever the screen was updated every time.

So I decided to use some kind of function to check if the stdin had something in it before continuing.  I finally settled on using the poll function, but unfortunately this is POSIX only if you are going to use it on a file descriptor like stdin.  Apparently on windows this is not so hard if you are dealing with sockets, but I was just using the standard input output.

Here were the things that I tried before just porting everything to linux:

 * ioctrlsocket with FIONREAD - only works with sockets
 * select - only works with sockets in windows
 * _kbhit - works great if you have a keyboard buffer, but our keyboard is on another computer so this won't work either. 