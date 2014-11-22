
process.stdin.on("readable", function(){
    
    var chunk = process.stdin.read();
    
    if (chunk != null){
        // do something with input
    }
    
    var RETURN_SIZE = 9;
    var buf = new Buffer(RETURN_SIZE);
    
    for (var i = 0; i < RETURN_SIZE; i++){
        var rand = Math.floor(Math.random()*255);
        buf.writeUInt8(rand, i);
    }

    process.stdout.write(buf);
});


