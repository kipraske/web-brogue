define([
    'dataIO/socket',
    'dataIO/router',
    'tests/mock-brogue-message-rand-full',
    'tests/mock-brogue-message-rand-few',
    'tests/mock-brogue-message-single',
    'tests/send-custom-socket-message'
], function(ws, router, brogueFullRandMsg, brogueFewRandMsg, brogueUpdateCell, customMessage) {

    //override socket onmessage to log all incoming messages
    ws.onmessage = function(event){
        var message = router.prepareIncomingData(event.data);
        if (message instanceof ArrayBuffer){
            var messageArray = new Uint8Array(message);
            console.log(messageArray);
        }
        else{
            console.log(message);
        }
        router.route(message);
    };

    // Eventually we should set up unit test assertions based on these functions, but for now these are just a collection of utility functions that we can use from the client to test the views and the socket commands.

    function attach(){
        window.brogueDebug = {
            dispatchConsoleFullRandom : brogueFullRandMsg,
            dispatchConsoleFewRandom : brogueFewRandMsg,
            dispatchConsoleSingleCell : brogueUpdateCell,
            sendMessage : customMessage
        };
    }

    return {
        attachToGlobalScope : attach
    };

});


