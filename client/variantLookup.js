define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    //Includes all historical variants, so the API response can be prettified
    var VariantLookup = {
        variants: {
            "BROGUEV174": {
                code: "BROGUEV174",
                display: "Brogue 1.7.4",
                consoleColumns: 100,
                consoleRows: 34
            },
            "GBROGUEV1180211": {
                code: "GBROGUEV1180211",
                display: "gBrogue v1.18.02.11",
                consoleColumns: 100,
                consoleRows: 36
            }
        }
    };
    return VariantLookup;
});