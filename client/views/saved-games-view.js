// View to show saved games to load

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/lobby-data-table-base",
    "models/lobby-data-table-state",
    "views/file-row-view",
    "models/file-row",
    "views/view-activation-helpers"
], function ($, _, Backbone, send, lobbyTableBase, LobbyTableState, FileRowView, FileRowModel, activate) {

    var fileViewCollection = {};

    var SavedGamesView = Backbone.View.extend({
        el: "#saved-games",
        tableSelector: "#saved-games-table",
        $tableElement: null,
        tableState: new LobbyTableState(),
        
        events: {
            "click .file-link" : "loadSavedGame"
        },
        
        initialize : function(){
            this.renderHeading();
        },
        
        headingTemplate: _.template($('#saved-games-heading').html()),

        updateRowModelData: function (data) {
            this.clearRowModelData();
            var numberOfGames = data.length;

            if (numberOfGames > 0) {
                this.tableState.set("isEmpty", false);
            }
            else{
                this.tableState.set("isEmpty", true);
            }
            
            this.renderHeadingOnEmptyChange();

            for (var i = 0; i < numberOfGames; i++) {
                var fileData = data[i];

                if (!fileViewCollection[fileData.fileName]) {
                    var fileModel = new FileRowModel(fileData);
                    var newFileView = fileViewCollection[fileData.fileName] = new FileRowView({
                        model: fileModel,
                        id: "game-row-" + i
                    });

                    this.$tableElement.append(newFileView.render().el);
                }
            }      
        },
        
        clearRowModelData : function(){
            fileViewCollection = {};
            
            if (this.$tableElement){          
                this.$tableElement.find(".file-row").remove();
            }

        },
        
        loadSavedGame : function(event){
            event.preventDefault();
   
            var fileName = event.target.innerHTML;
            send("brogue", "start", {
                savedGame : fileName
            });
            
            activate.console();
        }
    });

    _.extend(SavedGamesView.prototype, lobbyTableBase);

    return SavedGamesView;

});
