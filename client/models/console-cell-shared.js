define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var ConsoleSharedState = {
        lastMouseOver: 0,
        mouseOverDelayedSend: 0
    };

    return ConsoleSharedState;
});