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
            console.log(rowCollection);
            // TODO - if the rowView render is NOT called remove it from the collection hrm... can one self-destruct in js?
        },
        
        updateUserData: function(data){
            for (var userName in data){              
                var update = data[userName];
                
                if (!rowCollection[userName]) {
                    var rowModel = new CurrentGamesRowModel(update);
                    rowCollection[userName] = new CurrentGamesRowView(rowModel);          
                }
                else {
                    rowCollection[userName].model.set(update);
                }
            }
            
            this.render();
        }
    });
    
    return CurrentGamesView;

});
