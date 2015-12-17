define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var UserLoggedInModel = Backbone.Model.extend({
        defaults: {
            username : ""
        }
    });

    return UserLoggedInModel;

});