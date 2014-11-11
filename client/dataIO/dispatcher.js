define ([
    "underscore",
    "dataIO/socket"
], function( _, socket ){
    
    var _messageQueue = [];
    var _handlers = {};
    
    var dispatcher = {
        registerHandlers : function(handlerCollection){  
            _extend(_handlers, handlerCollection);
        },
        prepareData : function(data){
            // deflate data
            // parse JSON and return object
        },
        enqueueMessage : function(){
            // puts the message in the queue
        },
        dispatch : function(){
            // takes next message in queue
            // removes from the queue
            // executes handler based on msg.dataType
        }
    };
    
    
    return dispatcher;
});


