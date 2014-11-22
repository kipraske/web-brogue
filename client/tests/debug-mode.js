define([
    'dataIO/socket',
    'tests/mock-brogue-message-rand-full',
    'tests/mock-brogue-message-rand-few',
    'tesets/send-custom-socket-message'
], function(ws, fullRandMsg, fewRandMsg, customMessage) {

    function attach(){
        window.brogueDebug = {
            dispatchFullRandom : fullRandMsg,
            dispatchFewRandom : fewRandMsg,
            sendMessage : customMessage
        };
    }

    return {
        attachToGlobalScope : attach
    };

});


