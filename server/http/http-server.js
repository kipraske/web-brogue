var path = require("path");

var express = require("express");
var app = express();

var clientPath = path.normalize(__dirname + "../../../client");
app.use(express.static(clientPath));

app.get("/", function(req, res){
    res.sendFile(clientPath + "/index.html");
});

console.log(clientPath);

server = app.listen(80, function(){
    
var port = server.address().port;
    console.log("http server listening on port %s", port);
});