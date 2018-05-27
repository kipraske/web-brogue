define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var Config = {
        variants: [
            { code: "BROGUEV174",
              display: "Brogue 1.7.4",
              consoleColumns: 100,
              consoleRows: 34 }
            ,
            { code: "GBROGUEV1180211",
                display: "gBrogue v1.18.02.11",
                consoleColumns: 100,
                consoleRows: 36 }
            ],
        websocketPort: 8080
    };

    return Config;
});