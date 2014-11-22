define ([
    "underscore",
    "dataIO/socket"
], function( _, socket ){
    
    var _handlers = {};
    
    //TODO - may wish to implement a message queue so we can prioritize some messages over others
    
    var router = {
        registerHandlers : function(handlerCollection){  
            _.extend(_handlers, handlerCollection);
        },
        prepareData : function(data){
            // deflate data
            // parse JSON and return object
        },
        route: function(message) {
            if (message instanceof ArrayBuffer){
                _handlers["brogue"](message);
            }

            if (_handlers[message.type]) {
                _handlers[message.type](message.data);
            }
        }
    };
    
    
    return router;
});


