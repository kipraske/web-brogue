// Main entry point in server side code.  Sets up http server and websocket server and routes
var domain = require("domain");
var config = require("./config");
var util = require("util");

httpServerDomain = domain.create();
httpServerDomain.on("error", function (err) {
    util.log("Uncaught exception emitted internally from Http Server. Process Terminating.");
    console.log(err.stack);
    process.exit(1);
});

httpServerDomain.run(function () {
    require("./httpServer")(config);
});