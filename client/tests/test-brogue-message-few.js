define(['dataIO/dispatcher'], function(dispatcher) {
    
    // Fills 5% of cells with a random character
    // Testing updating less of the cells at a time which is more realistic for real game data
    
    function dispatchFewMessage() {
        var fillArray = [];
        var setNextColor = 0;

        for (var i = 0; i < 34 * 100 * 7; i++) {   
            if (i % 7 === 0 && Math.random() < 0.05){
                setNextColor = 3;
                fillArray[i] = Math.floor(Math.random()*255);
            }
            else if (setNextColor > 0){
                fillArray[i] = Math.floor(Math.random()*255);
                setNextColor--;
            }
            else{
                fillArray[i] = 0;
            }
        }

        var message = {
            type: "brogue",
            data: fillArray
        };
        
        dispatcher.dispatch(message);
    }
    
    return dispatchFewMessage;
});


