define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/file-row-view",
    "models/file-row",
], function ($, _, Backbone, send, FileRowView, FileRowModel) {

    var fileViewCollection = {};

    var SavedGamesView = Backbone.View.extend({
        el: "#saved-games",
        tableSelector: "#saved-games-table",
        $tableElement: null,
        tableState: new LobbyTableState(),
        
        initialize: function () {

        },
        headingTemplate: _.template($('#saved-games-heading').html()),
        
        // TODO - rewrite this for saved games = currently the same as the current games
        
        updateRowModelData: function (data) {
            this.tableState.set("isEmpty", true);
            // handle incoming user data
            for (var incomingUserName in data) {
                this.tableState.set("isEmpty", false);
                // were there no user rows but now there is?
                this.renderHeadingOnEmptyChange();

                var update = data[incomingUserName];

                if (!rowViewCollection[incomingUserName]) {
                    var rowData = _.extend(update, {
                        userName: incomingUserName
                    });

                    var rowModel = new CurrentGamesRowModel(rowData);
                    var newRowView = rowViewCollection[incomingUserName] = new CurrentGamesRowView({
                        model: rowModel,
                        id: "game-row-" + incomingUserName,
                    });
                    this.$tableElement.append(newRowView.render().el);
                }
                else {
                    rowViewCollection[incomingUserName].model.set(update);
                    rowViewCollection[incomingUserName].render();
                }
            }

            // clean up stale users
            for (var existingUserName in rowViewCollection) {
                if (!data || !data[existingUserName]) {
                    rowViewCollection[existingUserName].remove();
                    delete rowViewCollection[existingUserName];
                }
            }
            // were there user rows before now there is not?
            this.renderHeadingOnEmptyChange();
        }
    });

    _.extend(SavedGamesView.prototype, lobbyTableBase);

    return SavedGamesView;

});
