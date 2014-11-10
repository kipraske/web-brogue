define([
    "jquery",
    "underscore",
    "backbone",
    "views/console-cell-view",
    'dataIO/dispatcher'
], function($, _, Backbone, ConsoleCellView, dispatcher) {

    var _CONSOLE_ROWS = 34;
    var _CONSOLE_COLUMNS = 100;

    var _consoleCells = [];

    var Console = Backbone.View.extend({
        el : "#console",
        
        events: {},
        initialize: function() {
            this.$el.removeClass();
            this.$el.addClass("full");
            this.initializeConsoleCells();

            //TODO - initialize console css class based on options
            //this.className = blah;

            this.render();
        },
        initializeConsoleCells: function() {
            for (var i = 0; i < _CONSOLE_ROWS; i++) {     
                var row = [];       
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    var cellView = new ConsoleCellView({
                        id : "console-cell-" + i + "-" + j,
                        x : i,
                        y: j
                    });
                    
                    this.$el.append(cellView.render().el);
                    row.push(cellView);
                    
                    // TODO render the new cell view and append it to this view
                    // this.el.append(cellview.render().el);
                    
                }          
                _consoleCells.push(row);
            }
        },

        render : function(){
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    _consoleCells[i][j].render();
                }          
            }
        },
        
        setModelData : function(data) {
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    _consoleCells[i][j].set(data[i][j]);
                }          
            }
        return this;
        }
        
    });

    var returnConsole = new Console();
    dispatcher.registerHandler(returnConsole.setModelData);

    return returnConsole;

});
