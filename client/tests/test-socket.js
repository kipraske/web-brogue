define(function(){
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
       onmessage : function () {
           // deflate message
           
           // parse JSON
           
           // split datatype from payload
           
           //dispatch message
       }
   }; 
   
   socket.onopen();
   
   return socket;
});


