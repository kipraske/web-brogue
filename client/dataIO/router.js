// Router for all incoming client websocket messages.

define([
    "underscore"
], function (_) {

    var _handlers = {};

    var router = {
        registerHandlers: function (handlerCollection) {
            _.extend(_handlers, handlerCollection);
        },
        route: function (message) {

            console.log("From server");
            console.log(JSON.stringify(message));

            if (message.type === 'b') {
                _handlers["brogue"](message.data);
            }
            else {

                if (message.type && _handlers[message.type]) {
                    _handlers[message.type](message.data);
                }
            }
        }
    };


    return router;
});


