define(['dataIO/dispatcher'], function(dispatcher) {

    // Fill the entire console with random background, foreground, and character values
    // Worst case scenario load test

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


