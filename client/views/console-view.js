// View for the entire console.  It is responsible for setting up all of the console-cell views

define([
    "jquery",
    "underscore",
    "backbone",
    'dataIO/send-keypress',
    "views/console-cell-view",
    "models/console-cell",
    "views/view-activation-helpers"
], function($, _, Backbone, sendKeypressEvent, ConsoleCellView, CellModel, activate) {

    var _CONSOLE_ROWS = 34;
    var _CONSOLE_COLUMNS = 100;
    var _MESSAGE_UPDATE_SIZE = 10;

    var _consoleCells = [];
    var _consoleWidth;
    var _consoleHeight;
    var _consoleCellTopOffsetPx;
    var _consoleCellLeftOffsetPx;
    var _consoleCellWidthPx;
    var _consoleCellHeightPx;
    var _consoleCellCharSizePx;
    var _consoleCellCharPaddingPx;
    var _consoleCellAspectRatio = 0.53;  //TODO: we may eventually want this to be adjustable

    var Console = Backbone.View.extend({
        el: "#console",
        events: {
            'focus' : 'giveKeyboardFocus'
        },
        initialize: function() {
            this.$el.addClass("full-width");
            this.$el.addClass("full-height");

            this.calculateConsoleSize();
            this.calculateConsoleCellSize();

            this.initializeConsoleCells();
        },
        initializeConsoleCells: function() {
            var consoleCellsFragment = document.createDocumentFragment();
            
            for (var i = 0; i < _CONSOLE_COLUMNS; i++) {
                var column = [];
                for (var j = 0; j < _CONSOLE_ROWS; j++) {
                    var cellModel = new CellModel({
                        x: i,
                        y: j,
                        widthPx: _consoleCellWidthPx,
                        heightPx: _consoleCellHeightPx,
                        charSizePx: _consoleCellCharSizePx,
                        charPaddingPx: _consoleCellCharPaddingPx,
                        topOffsetPx: _consoleCellTopOffsetPx,
                        leftOffsetPx: _consoleCellLeftOffsetPx
                    });

                    var cellView = new ConsoleCellView({
                        model: cellModel,
                        id: "console-cell-" + i + "-" + j
                    });

                    consoleCellsFragment.appendChild(cellView.render().el);
                    column.push(cellView);
                }
                _consoleCells.push(column);
            }
            
            this.$el.append(consoleCellsFragment);
        },
        calculateConsoleSize: function() {
            _consoleWidth = this.$el.width();
            _consoleHeight = this.$el.height();
        },
        calculateConsoleCellSize: function() {          
            //By default we want to use the full width
            _consoleCellWidthPx = _consoleWidth / _CONSOLE_COLUMNS | 0; // using |0 is much faster than Math.floor
            _consoleCellHeightPx = _consoleCellWidthPx / _consoleCellAspectRatio | 0;

            //If this height will make the console go off screen, recalculate size and horizontally center instead
            if (_consoleCellHeightPx * _CONSOLE_ROWS > _consoleHeight) {              
                _consoleCellHeightPx = _consoleHeight / _CONSOLE_ROWS | 0;
                _consoleCellWidthPx = _consoleCellHeightPx * _consoleCellAspectRatio;
                
                _consoleCellTopOffsetPx = 0;
                _consoleCellLeftOffsetPx = (_consoleWidth - _consoleCellWidthPx * _CONSOLE_COLUMNS) / 2 | 0;
            }
            else {
                // Vertically center the console
                _consoleCellLeftOffsetPx = 0;
                _consoleCellTopOffsetPx = (_consoleHeight - _consoleCellHeightPx * _CONSOLE_ROWS) / 2 | 0;
            }

            // Cell Character Positioning
            _consoleCellCharSizePx = _consoleCellHeightPx * 3 / 5;
            _consoleCellCharPaddingPx = _consoleCellHeightPx / 5;
        },
        render: function() {
            for (var i = 0; i < _CONSOLE_COLUMNS; i++) {
                for (var j = 0; j < _CONSOLE_ROWS; j++) {
                    _consoleCells[i][j].render();
                }
            }
        },

        resize: function() {
            this.calculateConsoleSize();
            this.calculateConsoleCellSize();
            for (var i = 0; i < _CONSOLE_COLUMNS; i++) {
                for (var j = 0; j < _CONSOLE_ROWS; j++) {
                    _consoleCells[i][j].model.set({
                        widthPx: _consoleCellWidthPx,
                        heightPx: _consoleCellHeightPx,
                        charSizePx: _consoleCellCharSizePx,
                        charPaddingPx: _consoleCellCharPaddingPx,
                        topOffsetPx: _consoleCellTopOffsetPx,
                        leftOffsetPx: _consoleCellLeftOffsetPx
                    });
                    _consoleCells[i][j].model.calculatePositionAttributes();
                    _consoleCells[i][j].applySize();
                }
            }
        },
        
        updateCellModelData: function (data) {
            var dataArray = new Uint8Array(data);
            var dataLength = dataArray.length;
            var dIndex = 0;

            while (dIndex < dataLength) {
                var dataXCoord = dataArray[dIndex++];
                var dataYCoord = dataArray[dIndex++];

                // Status updates have coords (255,255). For now ignore these, eventually we may find a UI use for them
                if (dataXCoord === 255 && dataYCoord === 255){
                    dIndex += _MESSAGE_UPDATE_SIZE - 2;
                    continue;
                }

                var combinedUTF16Char = dataArray[dIndex++] << 8 | dataArray[dIndex++];

                _consoleCells[dataXCoord][dataYCoord].model.set({
                    char: combinedUTF16Char,
                    foregroundRed: dataArray[dIndex++],
                    foregroundGreen: dataArray[dIndex++],
                    foregroundBlue: dataArray[dIndex++],
                    backgroundRed: dataArray[dIndex++],
                    backgroundGreen: dataArray[dIndex++],
                    backgroundBlue: dataArray[dIndex++]
                });

                _consoleCells[dataXCoord][dataYCoord].render();
            }
        },
        
        clearConsole : function(){
            for (var i = 0; i < _CONSOLE_COLUMNS; i++) {
                for (var j = 0; j < _CONSOLE_ROWS; j++) {
                    _consoleCells[i][j].model.clear();
                    _consoleCells[i][j].render();
                }
            }
        },
        
        giveKeyboardFocus : function(){
            $('#console-keyboard').focus();
        },
        
        exitToLobby : function(message){
            activate.lobby();
            this.clearConsole();
        }
    });

    return Console;

});
