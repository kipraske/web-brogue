define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/lobby-data-table-base",
    "views/current-games-row-view",
    'models/lobby-data-table-state',
    "models/current-games-row"
], function ($, _, Backbone, send, lobbyTableBase, CurrentGamesRowView, LobbyTableState, CurrentGamesRowModel) {

    var rowViewCollection = {};

    var CurrentGamesView = Backbone.View.extend({
        el: "#current-games",
        tableSelector : "#current-games-table",
        $tableElement: null,
        tableState : new LobbyTableState(),
        
        initialize : function(){
            this.renderHeading();
            send("lobby", "requestAllUserData");
        },
        
        headingTemplate : _.template($('#current-games-heading').html()),    
        
        updateRowModelData: function(data){           
            this.tableState.set("isEmpty", true);
            // handle incoming user data
            
            if (data){
                this.tableState.set("isEmpty", false);
                // were there no user rows but now there is?
                this.renderHeadingOnEmptyChange();
            }
            
            for (var incomingUserName in data){
                var update = data[incomingUserName];
                
                if (!rowViewCollection[incomingUserName]) {
                    var rowData = _.extend(update, {
                        userName: incomingUserName
                    });
                    
                    var rowModel = new CurrentGamesRowModel(rowData);
                    var newRowView = rowViewCollection[incomingUserName] = new CurrentGamesRowView({
                        model : rowModel,
                        id : "game-row-" + incomingUserName,
                    });
                    this.$tableElement.append(newRowView.render().el);
                }
                else {
                    rowViewCollection[incomingUserName].model.set(update);
                    rowViewCollection[incomingUserName].render();
                }   
            }
            
            // clean up stale users
            for (var existingUserName in rowViewCollection){
                if (!data || !data[existingUserName]){
                    rowViewCollection[existingUserName].remove();
                    delete rowViewCollection[existingUserName];
                }
            }
            // were there user rows before now there is not?
            this.renderHeadingOnEmptyChange();
        }
    });
    
    _.extend(CurrentGamesView.prototype, lobbyTableBase);
    
    return CurrentGamesView;

});
