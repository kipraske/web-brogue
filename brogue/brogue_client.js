var assert = require('assert');
var fs = require('fs');

var unix = require('./node-unix-dgram/lib/unix_dgram');
var SOCKNAME = 'server-socket';
var SOCKNAME_CLIENT = 'client-socket';

try { fs.unlinkSync(SOCKNAME_CLIENT); } catch (e) { /* swallow */ }

var send_ping_to_server = function() {

    var sendBuf = new Buffer(5);
    sendBuf[0] = 0; //keystroke
    sendBuf[1] = 0; //upper byte
    sendBuf[2] = 105; //i
    sendBuf[3] = 0; //mod
    sendBuf[4] = 0; //mod

    server_write.send(sendBuf, 0, 5, SOCKNAME, function() {
	    console.error('client send', arguments);
    });

    //Do it again in 2 secs
    setTimeout(send_ping_to_server, 2000);
};

var client_read = unix.createSocket('unix_dgram', function(buf, rinfo) {
    console.error('data: (%d, %d) -> %s', buf[0], buf[1], String.fromCharCode(buf[3]));
});
client_read.bind(SOCKNAME_CLIENT);

var server_write = unix.createSocket('unix_dgram', function(buf, rinfo) {
  //console.error('client recv', arguments);
  //assert(0);
});

send_ping_to_server();

//setInterval( function() {
//  console.log('looping');
//}, 225);
