// Model for a single row for files on the server.  For instance it is used for viewing saved games

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
            var modifiedDate = new Date(this.get("modified"));
            var dateString = modifiedDate.toLocaleString();
            this.set("formattedModified", dateString);
        }
    });
    
    return File;
    
});