define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    File = Backbone.Model.extend({
        defaults: {
            fileName : "",
            modified : "",
            formattedModified : null
        },
        
        formatModifiedDate : function(){
            var modifiedDate = new Date(this.model.get("modified"));
            var dateString = modifiedDate.toLocaleString();
            this.model.set("formattedModified", dateString);
        }
    });
    
    return File;
    
});