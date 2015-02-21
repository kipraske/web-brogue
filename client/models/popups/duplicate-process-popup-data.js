// Model for holding information about the actions for the duplicate view

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    
    var DuplicateBrogueModel = Backbone.Model.extend({
        
        // Doesn't do much but store the current username to pass along to the other views
        defaults: {
            brogueProcessData : null,
            action : ""
        },
        
        calculateActionText : function(){
            var brogueProcessData = this.get('brogueProcessData');
            
            if (!brogueProcessData){
                this.set("action", "starting a new game");
            }
            else if (brogueProcessData.savedGame){
                this.set("action", "loading a saved game");
            }
            else if (brogueProcessData.seed || brogueProcessData.seed === ""){
                this.set("action", "starting a new game with seed");
            }
        }
    });

    return DuplicateBrogueModel;

});

