define([
    "jquery",
    "underscore",
    "backbone",
    "views/current-games-row-view",
    "models/current-games-row",
], function ($, _, Backbone, CurrentGamesRowView, CurrentGamesRowModel) {

    var rowViewCollection = {};

    var CurrentGamesView = Backbone.View.extend({
        el: "#current-games",
        
        render: function(){ 
            for (var userName in rowViewCollection){
                rowViewCollection[userName].render();
            }
        },
        
        updateUserData: function(data){
            // render incoming user data
            for (var incomingUserName in data){              
                var update = data[incomingUserName];
                
                if (!rowViewCollection[incomingUserName]) {
                    var rowModel = new CurrentGamesRowModel(update);
                    rowViewCollection[incomingUserName] = new CurrentGamesRowView(rowModel);
                }
                else {
                    rowViewCollection[incomingUserName].model.set(update);
                }
                
                rowViewCollection[incomingUserName].render();
            }
            
            // clean up stale users
            for (var existingUserName in rowViewCollection){
                if (! data[existingUserName]){
                    delete rowViewCollection[existingUserName];
                }
            }
        }
    });
    
    return CurrentGamesView;

});
