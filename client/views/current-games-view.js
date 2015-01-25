define([
    "jquery",
    "underscore",
    "backbone",
    "models/current-games"
], function ($, _, Backbone, CurrentGamesModel) {

    var CurrentGamesView = Backbone.View.extend({
        el: "#current-games",
        model: new CurrentGamesModel(),
        
        initialize: function(){
            
        },
        
        render: function(){
            
        },
        
        updateUserData: function(){
            
        }
    });
    
    return CurrentGamesView;

});
