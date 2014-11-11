define(['dataIO/dispatcher'], function(dispatcher) {

    function dispatchRandomMessage() {
        var fillArray = [];

        for (var i = 0; i < 34 * 100 * 7; i++) {
            fillArray[i] = Math.floor(Math.random() * 255);
        }

        var message = {
            type: "brogue",
            data: fillArray
        };
        
        dispatcher.dispatch(message);
    }
    
    return dispatchRandomMessage;
});


