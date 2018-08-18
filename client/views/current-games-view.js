// View for a single row in current games rollup in the lobby

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/lobby-data-table-base",
    "views/current-games-row-view",
    'models/lobby-data-table-state',
    "models/current-games-row",
    "models/user-logged-in"
], function ($, _, Backbone, send, lobbyTableBase, CurrentGamesRowView, LobbyTableState, CurrentGamesRowModel, UserLoggedInModel) {

    var rowViewCollection = {};

    var CurrentGamesView = Backbone.View.extend({
        el: "#current-games",
        tableSelector : "#current-games-table",
        $tableElement: null,
        userModel: new UserLoggedInModel(),
        tableState : new LobbyTableState(),
        
        initialize : function(){
            this.renderHeading();
            send("lobby", "requestAllUserData");
        },
        
        headingTemplate : _.template($('#current-games-heading').html()),    

        render: function() {
            this.updateRowModelData();
        },

        updateRowModelData: function(data){                    
            // handle incoming user data
            if (data) {
                this.tableState.set("isEmpty", false);
            }
            else {
                this.tableState.set("isEmpty", true);
            }
            
            this.renderHeadingOnEmptyChange();
            
            for (var incomingGameName in data) {
                var update = data[incomingGameName];

                var action = "Observe " + update.userName;

                if(update.userName === this.userModel.get("username")) {
                    action = "Continue game";
                }

                if (!rowViewCollection[incomingGameName]) {
                    var rowData = _.extend(update, {
                        userName: update.userName,
                        action: action
                    });
                    
                    var rowModel = new CurrentGamesRowModel(rowData);
                    var newRowView = rowViewCollection[incomingGameName] = new CurrentGamesRowView({
                        model : rowModel,
                        id : "game-row-" + incomingGameName
                    });
                    this.$tableElement.append(newRowView.render().el);
                }
                else {
                    rowViewCollection[incomingGameName].model.set(update);
                    rowViewCollection[incomingGameName].render();
                }   
            }
            
            // clean up stale users
            for (var existingUserName in rowViewCollection){
                if (!data || !data[existingUserName]){
                    rowViewCollection[existingUserName].remove();
                    delete rowViewCollection[existingUserName];
                }
            }
        },
        login : function(username){
            this.userModel.set({
                username : username
            });

            this.render();
        },

        logout: function() {

            this.userModel.set({
                username : ""
            });

            this.render();
        }
    });
    
    _.extend(CurrentGamesView.prototype, lobbyTableBase);
    
    return CurrentGamesView;

});
