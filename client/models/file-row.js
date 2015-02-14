define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    File = Backbone.Model.extend({
        defaults: {
            name : "",
            created : "",
            owner : ""
        } 
    });
    
    return File;
    
});