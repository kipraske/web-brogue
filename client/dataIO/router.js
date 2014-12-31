define([
    "underscore",
    "backbone"
], function (_, Backbone) {

    var _socketHandlers = {};

    var Router = Backbone.Router.extend({
        
        // WebSocket route handlers and execution
        ws: {
            registerHandlers: function (handlerCollection) {
                _.extend(_socketHandlers, handlerCollection);
            },
            route: function (rawMessage) {
                if (message instanceof ArrayBuffer) {
                    _socketHandlers["brogue"](rawMessage);
                }

                var message = JSON.parse(rawMessage);

                if (message.type && message.data && _socketHandlers[message.type]) {
                    _socketHandlers[message.type](message.data);
                }
            }
        }
    });

    return new Router();
});


