// Model for authentication view

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    var AuthenticataionModel = Backbone.Model.extend({
        
        // Doesn't do much but store the current username to pass along to the other views
        defaults: {
            username : ""
        }
    });

    return AuthenticataionModel;

});
