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
        el: "main",
        className: "full",
        events: {},
        initialize: function() {
            this.initializeConsoleCellModels();


            //TODO - initialize console css class based on options
            //this.className = blah;

        },
        initializeConsoleCellModels: function() {
            for (var i = 0; i < _CONSOLE_ROWS; i++) {     
                var row = [];       
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    row.push(new ConsoleCellView({
                        x : i,
                        y: j
                    }));
                }          
                _consoleCells.push(row);
            }
        },

        render : function(){
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    _consoleCells[i][j].render();
                    
                    //TODO : I never added the subviews to the DOM so they are not being added anywhere.  http://stackoverflow.com/questions/9292160/backbone-js-views-parent-elements
                    
                }          
            }
        },
        
        setModelData : function(data) {
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    _consoleCells[i][j].set(data[i][j]);
                }          
            }
        }
    });

    var returnConsole = new Console();
    dispatcher.registerHandler(returnConsole.setModelData);

    return returnConsole;

});
