// Model to track if we need to render the empty view or not for lobby rollups

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    TableState = Backbone.Model.extend({
        defaults: {
            isEmpty : true,
            oldIsEmpty : true
        } 
    });
    
    return TableState;
    
});

