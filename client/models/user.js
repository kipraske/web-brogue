define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var UserModel = Backbone.Model.extend({
        defaults: {
            username : ""
        }
    });

    return UserModel;

});