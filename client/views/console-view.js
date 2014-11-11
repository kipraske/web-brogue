define([
    "jquery",
    "underscore",
    "backbone",
    'dataIO/dispatcher',
    "views/console-cell-view",
    "models/console-cell"
], function($, _, Backbone, dispatcher, ConsoleCellView, CellModel) {

    var _CONSOLE_ROWS = 34;
    var _CONSOLE_COLUMNS = 100;

    var _consoleCells = [];
    var _consoleWidth;
    var _consoleHeight;
    var _consoleCellWidthPercent;
    var _consoleCellHeightPercent;
    var _consoleCellAspectRatio = 0.53;  //TODO: set this via options model, reset via resize function

    var Console = Backbone.View.extend({
        el : "#console",
        
        events: {},
        initialize: function() {
            
            //TODO: set console size based on options that are set
            // For now we will use the full settings
            
            this.$el.addClass("full-width");
            this.$el.addClass("partial-height");
            
            this.calculateConsoleSize();
            this.calculateConsoleCellSize();
            
            this.initializeConsoleCells();

            this.render();
        },
        initializeConsoleCells: function() {
            for (var j = 0; j < _CONSOLE_ROWS; j++) {     
                var row = [];       
                for (var i = 0; i < _CONSOLE_COLUMNS; i++) {
                    var cellModel = new CellModel({
                        x : i,
                        y : j,
                        widthPercent : _consoleCellWidthPercent,
                        heightPercent : _consoleCellHeightPercent
                    });
                    
                    var cellView = new ConsoleCellView({
                        model : cellModel,
                        id : "console-cell-" + i + "-" + j
                    });

                    this.$el.append(cellView.render().el);
                    row.push(cellView);                  
                }          
                _consoleCells.push(row);
            }
        },
        
        calculateConsoleSize : function(){
            _consoleWidth = this.$el.width();
            _consoleHeight = this.$el.height();
        },
        
        calculateConsoleCellSize : function(){
            _consoleCellWidthPercent = 100 / _CONSOLE_COLUMNS;
            
            var cellPixelWidth = _consoleWidth * (_consoleCellWidthPercent / 100);
            var cellPixelHeight = cellPixelWidth / _consoleCellAspectRatio;
            
            if (cellPixelHeight * _CONSOLE_ROWS > _consoleHeight){
                _consoleCellHeightPercent = 100 / _CONSOLE_ROWS;
            }
            else{
                _consoleCellHeightPercent = 100 * cellPixelHeight / _consoleHeight;
            }
        },
        
        resizeConsoleCells : function(){
            
        },

        render : function(){
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    _consoleCells[i][j].render();
                }          
            }
        },
        
        updateModelData : function(data) {
            
            var dIndex = 0;
            
            for (var i = 0; i < _CONSOLE_ROWS; i++) {          
                for (var j = 0; j < _CONSOLE_COLUMNS; j++) {
                    var setobj = {
                        char: data[dIndex++],
                        foregroundRed: data[dIndex++],
                        foregroundGreen: data[dIndex++],
                        foregroundBlue: data[dIndex++],
                        backgroundRed: data[dIndex++],
                        backgroundGreen: data[dIndex++],
                        backgroundBlue: data[dIndex++]
                    };
                    
                    
                    _consoleCells[i][j].model.set(setobj);
                    _consoleCells[i][j].render();
                }          
            }
        return this;
        }
        
    });

    return Console;

});
