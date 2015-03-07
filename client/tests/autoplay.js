// I want to load test my server with lots of connections.
// This will have a player always autoexplore and restart a game when they quit
// Also throws in some random keys for testing

define([
    'dataIO/router',
    'dataIO/send-generic',
    'dataIO/send-keypress',
    'dataIO/send-mouse'
], function(router, send, sendKey, sendMouse){
    
    function autoplay() {
        // reset each time we die/quit the game
        router.registerHandlers({
            "quit": restartOnQuit
        });

        AILoop();
    }
    
    var restartOnQuit = function(){
        send('brogue', 'start');
    };
    
    // Autoplay Event Loop
    var AILoop = function(){
        
        var rand = Math.random();
        
        if (rand < 0.65){
            sendAutoPlay();
            next(10000);
        }
        else if (rand < 0.85){
            sendThreeEsc();
            next(0);
        }
        //TODO - these would be nice to get some i/o going for more realistic testing
        else if (rand < 0.95){
            // send mouse click
            next(0);
        }
        else if (rand < 0.995){
            // send random keystroke
            next(0);
        }
        else{
            // 0.5% chance of reloading the page and severing the connection in 
            // the most dirty way possible
            var forcedReload = true;
            window.location.reload(forcedReload);
        }
        
    };
    
    var next = function(time){
        setTimeout(AILoop, time);
    };
    
    var sendAutoPlay = function(){
        sendKey(0, 65, 0, 0);
    };
    
    var sendThreeEsc = function(){
        sendKey(0, 27, 0, 0);
        sendKey(0, 27, 0, 0);
        sendKey(0, 27, 0, 0);
    };
    
    
    return autoplay;
    
});


