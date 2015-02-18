// Router for all incoming client websocket messages.

define([
    "underscore"
], function (_) {

    var _handlers = {};

    var router = {
        registerHandlers: function (handlerCollection) {
            _.extend(_handlers, handlerCollection);
        },
        route: function (rawMessage) {
            if (rawMessage instanceof ArrayBuffer) {
                _handlers["brogue"](rawMessage);
            }
            else {
                var message = JSON.parse(rawMessage);

                if (message.type && _handlers[message.type]) {
                    _handlers[message.type](message.data);
                }
            }
        }
    };


    return router;
});


