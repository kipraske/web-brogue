
process.stdin.on("readable", function(){
    
    var chunk = process.stdin.read();
    
    if (chunk != null){
        // do something with input
    }
    
    var ROW_NUMBER = 34;
    var COL_NUMBER = 100;
    
    var RETURN_SIZE = 9;
    var buf = new Buffer(RETURN_SIZE);
    
    var rowRand = Math.floor(Math.random()* ROW_NUMBER);
    buf.writeUInt8(rowRand, 0);
   
    var colRand = Math.floor(Math.random() * COL_NUMBER);
    buf.writeUInt8(colRand, 1);
    
    for (var i = 2; i < RETURN_SIZE; i++){
        var rand = Math.floor(Math.random()*255);
        buf.writeUInt8(rand, i);
    }

    process.stdout.write(buf);
});


