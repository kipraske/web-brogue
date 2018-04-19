define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var Config = {
        variants: [
            { code: "BROGUE174",
              display: "Brogue 1.7.4"},
            { code: "GBROGUE",
              display: "gbrogue 1.7.4" }
            ],
        websocketPort: 8080
    };

    return Config;
});