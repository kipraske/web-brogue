define ([
    "underscore"
], function( _ ){
    
    var _handlers = {};
    
    //TODO - may wish to implement a message queue so we can prioritize some messages over others
    
    //TODO - depending on how chat happens we may want to have this router work the same as the server side router with three parameters controller - the main view, type - how the view should process, and data.  Maybe not though, there is probably not too many
    
    var router = {
        registerHandlers : function(handlerCollection){  
            _.extend(_handlers, handlerCollection);
        },
        prepareIncomingData : function(data){
            if (data instanceof ArrayBuffer){
                return data;
            }
            else {
                // TODO - may wish eventually to gzip the incoming JSON, will have to decompress here then
                
                return JSON.parse(data);
            }
            
            return message;
        },
        prepareOutgoingData : function (controller, type, data){
            var messageObj = {
                controller : controller,
                type : type,
                data : data
            };
            
            return JSON.stringify(messageObj);
        },
        route: function(message) {
            if (message instanceof ArrayBuffer){
                _handlers["brogue"](message);
            }
            
            if (message.type && message.data && _handlers[message.type]) {
                _handlers[message.type](message.data);
            }
        }
    };
    
    
    return router;
});


