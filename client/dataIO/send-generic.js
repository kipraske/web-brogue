// Send JSON data to the server

define(['dataIO/socket'], function (ws) {

    function send(controller, type, data) {
        var messageObj = {
            controller: controller,
            type: type,
            data: data
        };
        var message = JSON.stringify(messageObj);
        
        ws.send(message);
    }

    return send;
});
