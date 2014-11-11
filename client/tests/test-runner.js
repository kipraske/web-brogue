define([
    'tests/test-socket',
    'tests/test-brogue-message-rand'
], function(tSocket, randMsg) {

    var tests = {};

    function attach(){
        window.tests = tests;
        
        tests.all = runAll;
        tests.randMsg = randMsg;
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


