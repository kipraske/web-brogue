define([
    'tests/test-socket',
    'tests/test-brogue-message-rand',
    'tests/test-brogue-message-few'
], function(tSocket, randMsg, fewMsg) {

    var tests = {};

    function attach(){
        window.tests = tests;
        
        tests.all = runAll;
        tests.randMsg = randMsg;
        tests.fewMsg = fewMsg;
    }
    
    function runAll(){
        for (var testKey in tests){
            if(tests.hasOwnProperty(testKey) && testKey !== 'all'){
                tests[testKey]();
            }
        }
    }

    return {
        attachToGlobalScope : attach
    };

});


