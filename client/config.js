define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var Config = {
        variants: [
            { code: "BROGUE174",
              display: "Brogue 1.7.4",
              consoleColumns: 100,
              consoleRows: 34 }
            ],
        websocketPort: 8080
    };

    return Config;
});