define(['dataIO/router'], function(router) {

    // TODO : update me so that we use the correct single-cell form of data update

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
        
        router.dispatch(message);
    }
    
    return dispatchRandomMessage;
});


