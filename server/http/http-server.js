var path = require("path");

var express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var app = express();

app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}));

var clientPath = path.normalize(__dirname + "../../../client");
app.use(express.static(clientPath));

app.get("/", function(req, res){
    res.sendFile(clientPath + "/index.html");
});

server = app.listen(80, function(){
    
var port = server.address().port;
    console.log("http server listening on port %s", port);
});