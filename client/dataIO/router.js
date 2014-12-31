define ([
    "underscore"
], function( _ ){
    
    var _handlers = {};
    
    var router = {
        registerHandlers : function(handlerCollection){  
            _.extend(_handlers, handlerCollection);
        },
        route: function(rawMessage) {
            if (message instanceof ArrayBuffer){
                _handlers["brogue"](rawMessage);
            }
            
            var message = JSON.parse(rawMessage);
            
            if (message.type && message.data && _handlers[message.type]) {
                _handlers[message.type](message.data);
            }
        }
    };
    
    
    return router;
});


