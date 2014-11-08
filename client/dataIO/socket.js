define(['dataIO/dispatcher'], function(dispatcher){
   //fake socket so I can hook it up
    var socket = {
       send : function (msg){
           console.log ("test message sent: ", msg);
       },
       close : function (){
           console.log ("test socket closing...");
           this.onclose();
       },
       onopen : function () {
           console.log("test socket open");
       },
       onerror : function () {
           console.error("test socket error thrown");
       },
       onclose : function () {
           console.log("test socket closed");
       },
       onmessage : function (evt) {
           
           // deflate message
           
           // parse JSON
           
           // split datatype from payload
           
           var payload = { json : "testdata"};
           var msgType = "test";
           
           // TODO: it seems the stone soup code contains a message queue which is handled when the script is ready for the next message
           // That would be a nice thing to do  here too
           
           // TODO : I think the dispatcher should be able to handle each of these steps
           // dispatcher.prepareData -> msg.dataType and msg.data etc
           // dispatcher.enqueueMessage(msg)
           // then in dispatcher dispatcher.dispatch(msg)-> calls the appropriate handler when system resources are good
           
           dispatcher.dispatch(msgType, payload);
       }
   }; 
   
   socket.onopen();
   
   return socket;
});


