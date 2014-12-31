define([
    'tests/mock-brogue-message-rand-full',
    'tests/mock-brogue-message-rand-few',
    'tests/mock-brogue-message-single',
    'tests/show-incoming-messages',
    'dataIO/send-generic',
    'dataIO/send-keypress',
    'dataIO/send-mouse'
], function(brogueFullRandMsg, brogueFewRandMsg, brogueUpdateCell, showIncomingMessages, customMessage, customKeyMessage, customMouseMessage) {

    // Eventually we should set up unit test assertions based on these functions, but for now these are just a collection of utility functions that we can use from the client to test the views and the socket commands.

    function attach(){
        window.brogue = {
            updateConsoleFullRandom : brogueFullRandMsg,
            updateConsoleFewRandom : brogueFewRandMsg,
            updateConsoleSingleCell : brogueUpdateCell,
            showIncomingMessages : showIncomingMessages,
            send : customMessage,
            sendKey : customKeyMessage,
            sendMouse : customMouseMessage
        };
    }

    return {
        attachToGlobalScope : attach
    };

});


