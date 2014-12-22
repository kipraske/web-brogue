define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var AuthenticationAndPlayModel = Backbone.Model.extend({
        defaults: {
            username : ""
        }
    });

    return AuthenticationAndPlayModel;

});
