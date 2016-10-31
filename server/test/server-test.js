var config = require("./config-test");
var httpServer = require("../httpServer")(config);

module.exports = httpServer;