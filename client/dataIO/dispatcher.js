define (["dataIO/socket"], function(socket){
    
    var messageQueue = [];
    var handlers = {};
    
    var dispatcher = {
        registerHandler : function(){
            // adds handler to handlers object
        },
        prepareData : function(){
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


