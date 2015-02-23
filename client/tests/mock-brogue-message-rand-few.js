// Fills 5% of cells with a random character and a grey background
// Testing updating less of the cells at a time which is more realistic for real game data

// TODO - update this test to reflect reality of how data comes over the line.  This is currently useful for load testing my application but not very accurate as a test anymore.

define(['tests/mock-brogue-message-single'], function(updateSingleCell) {

    function dispatchRandomFewMessages() {
        
        var CONSOLE_ROWS = 34;
        var CONSOLE_COLUMNS = 100;
        
        for ( var i = 0; i < CONSOLE_COLUMNS; i++){
            for ( var j = 0; j < CONSOLE_ROWS; j++){
                
                if (Math.random() > 0.05) continue;
                
                var updateX = i;
                var updateY = j;
                var updateChar = Math.floor(Math.random() * 255);
                var updateFRed = Math.floor(Math.random() * 255);
                var updateFGreen = Math.floor(Math.random() * 255);
                var updateFBlue = Math.floor(Math.random() * 255);
                var updateBRed = 50;
                var updateBGreen = 50;
                var updateBBlue = 50;
                
                updateSingleCell(updateX, updateY, updateChar, updateFRed, updateFGreen, updateFBlue, updateBRed, updateBGreen, updateBBlue);
            }
        }
    }
    
    return dispatchRandomFewMessages;
});


