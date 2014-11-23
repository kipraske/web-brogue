define(['tests/mock-brogue-message-single'], function(updateSingleCell) {

    // Fill the entire console with random background, foreground, and character values
    // Worst case scenario load test

    function dispatchRandomFullMessages() {
        
        var CONSOLE_ROWS = 34;
        var CONSOLE_COLUMNS = 100;
        
        for ( var i = 0; i < CONSOLE_COLUMNS; i++){
            for ( var j = 0; j < CONSOLE_ROWS; j++){
                
                var updateX = i;
                var updateY = j;
                var updateChar = Math.floor(Math.random() * 255);
                var updateFRed = Math.floor(Math.random() * 255);
                var updateFGreen = Math.floor(Math.random() * 255);
                var updateFBlue = Math.floor(Math.random() * 255);
                var updateBRed = Math.floor(Math.random() * 255);
                var updateBGreen = Math.floor(Math.random() * 255);
                var updateBBlue = Math.floor(Math.random() * 255);
                
                updateSingleCell(updateX, updateY, updateChar, updateFRed, updateFGreen, updateFBlue, updateBRed, updateBGreen, updateBBlue);
            }
        }
    }
    
    return dispatchRandomFullMessages;
});


