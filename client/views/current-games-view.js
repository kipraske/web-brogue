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
        
        initialize : function(){
            // This is static, but it looks better if it comes out with the rest of the views
            this.$el.append("<h2>Current Games</h2>");
        },
        
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
                    var newRowView = rowViewCollection[incomingUserName] = new CurrentGamesRowView({
                        model : rowModel,
                        id : "game-row-" + incomingUserName,
                    });
                    this.$el.append(newRowView.render().el);
                }
                else {
                    rowViewCollection[incomingUserName].model.set(update);
                    rowViewCollection[incomingUserName].render();
                }   
            }
            
            // clean up stale users
            for (var existingUserName in rowViewCollection){
                if (! data[existingUserName]){
                    rowViewCollection[existingUserName].remove();
                    delete rowViewCollection[existingUserName];
                }
            }
        }
    });
    
    return CurrentGamesView;

});
