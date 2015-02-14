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

