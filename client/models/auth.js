define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var AuthenticataionModel = Backbone.Model.extend({
        defaults: {
            username : ""
        }
    });

    return AuthenticataionModel;

});
