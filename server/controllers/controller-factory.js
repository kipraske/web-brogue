
// This factory initializes each controller and attaches all the controllers used by the socket instance within scope of one another
// This way, each controller can call methods on the other controllers if needed, but still be in separate files.
// controllersList is an array of the names of the controllers (which match the filenames).

module.exports = function(ws, controllersList) {
    
    var controllerInstances = {};
    var numControllers = controllersList.length;
    
    for (var i = 0; i < numControllers; i++){
        var cName = controllersList[i];
        var cPath = "./" + cName + "-controller";
        console.log(cPath);
        var ControllerClass = require(cPath);
        var controllerInstance = new ControllerClass(ws);
        //TODO: remove debug
        console.error("New controller instance: " + cPath);

        controllerInstances[controllerInstance.controllerName] = controllerInstance;
    }
    
    for (var cKey in controllerInstances){
        controllerInstances[cKey].controllers = controllerInstances;
    }
    
    return controllerInstances;
};