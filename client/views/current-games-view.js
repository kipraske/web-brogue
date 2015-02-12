define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "views/current-games-row-view",
    "models/current-games-row",
], function ($, _, Backbone, send, CurrentGamesRowView, CurrentGamesRowModel) {

    var rowViewCollection = {};
    var isEmpty = true;
    var oldIsEmpty = true;

    var CurrentGamesView = Backbone.View.extend({
        el: "#current-games",
        $tableElement : null,
        
        initialize : function(){
            this.renderHeading();
            send("lobby", "requestAllUserData");
        },
        
        headingTemplate : _.template($('#current-games-heading').html()),
        
        renderHeading : function(){
            this.$el.html(this.headingTemplate({isEmpty : isEmpty}));
        },

        renderHeadingOnEmptyChange: function () {
            if (isEmpty !== oldIsEmpty) {
                this.renderHeading();
                oldIsEmpty = isEmpty;
                
                if (!isEmpty) {
                    this.$tableElement = this.$el.find('#current-games-table');
                }
            }
        },
        
        
        updateRowModelData: function(data){
            isEmpty = true;
            // handle incoming user data
            for (var incomingUserName in data){
                isEmpty = false;
                // were there no user rows but now there is?
                this.renderHeadingOnEmptyChange();
                
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
    
    return CurrentGamesView;

});
