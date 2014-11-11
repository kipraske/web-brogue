define ([
    "underscore",
    "dataIO/socket"
], function( _, socket ){
    
    var _handlers = {};
    
    //TODO - may wish to implement a message queue so we can prioritize some messages over others
    
    var dispatcher = {
        registerHandlers : function(handlerCollection){  
            _.extend(_handlers, handlerCollection);
        },
        prepareData : function(data){
            // deflate data
            // parse JSON and return object
        },
        dispatch : function(message){
            _handlers[message.type](message.data);
        }
    };
    
    
    return dispatcher;
});


