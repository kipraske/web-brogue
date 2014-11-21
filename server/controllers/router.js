
var _ = require('underscore');

var _handlers = {};

var router = {
    recieve: {
        registerHandlers: function(handlerCollection) {
            _.extend(_handlers, handlerCollection);
        },
        prepareData: function(rawMessage) {
            // parse JSON and return object
            return rawMessage;
        },
        route: function(message) {
            _handlers[message.type](message.data);
        }
    },
    send: {
        prepareData: function(messageType, messageData) {
            var messageObject = {
                "type" : messageType,
                "data" : messageData
            };
                    
            return JSON.stringify(messageObject);
        }
        // TODO: here is where we would compress as well if we wanted to do such things
    }

};

module.exports = router;