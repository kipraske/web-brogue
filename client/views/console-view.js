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
    var _consoleCellTopOffsetPercent;
    var _consoleCellLeftOffsetPercent;
    var _consoleCellWidthPercent;
    var _consoleCellHeightPercent;
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
                        widthPercent: _consoleCellWidthPercent,
                        heightPercent: _consoleCellHeightPercent,
                        charSizePx: _consoleCellCharSizePx,
                        charPaddingPx: _consoleCellCharPaddingPx,
                        topOffsetPercent: _consoleCellTopOffsetPercent,
                        leftOffsetPercent: _consoleCellLeftOffsetPercent
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
            _consoleCellWidthPercent = 100 / _CONSOLE_COLUMNS;

            // Cell Aspect Ratio
            var cellPixelWidth = _consoleWidth * (_consoleCellWidthPercent / 100);
            var cellPixelHeight = cellPixelWidth / _consoleCellAspectRatio;

            //If this height will make the console go off screen, recalculate size and horizontally center instead
            if (cellPixelHeight * _CONSOLE_ROWS > _consoleHeight) {              
                cellPixelHeight = _consoleHeight / _CONSOLE_ROWS;
                cellPixelWidth = cellPixelHeight * _consoleCellAspectRatio;

                _consoleCellHeightPercent = 100 / _CONSOLE_ROWS;
                _consoleCellWidthPercent = 100 * cellPixelWidth / _consoleWidth;
                _consoleCellTopOffsetPercent = 0;

                var leftOffSetPx = (_consoleWidth - cellPixelWidth * _CONSOLE_COLUMNS) / 2;
                _consoleCellLeftOffsetPercent = leftOffSetPx / _consoleWidth * 100;
            }
            else {
                // Vertically center the console
                _consoleCellHeightPercent = 100 * cellPixelHeight / _consoleHeight;
                _consoleCellLeftOffsetPercent = 0;
                var topOffSetPx = (_consoleHeight - cellPixelHeight * _CONSOLE_ROWS) / 2;
                _consoleCellTopOffsetPercent = topOffSetPx / _consoleHeight * 100;
            }

            // Cell Character Positioning
            _consoleCellCharSizePx = cellPixelHeight * 3 / 5;
            _consoleCellCharPaddingPx = cellPixelHeight / 10;
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
                        widthPercent: _consoleCellWidthPercent,
                        heightPercent: _consoleCellHeightPercent,
                        charSizePx: _consoleCellCharSizePx,
                        charPaddingPx: _consoleCellCharPaddingPx,
                        topOffsetPercent: _consoleCellTopOffsetPercent,
                        leftOffsetPercent: _consoleCellLeftOffsetPercent
                    });
                    _consoleCells[i][j].model.calculatePositionAttributes();
                    _consoleCells[i][j].applySize();
                }
            }
        },
        
        queueUpdateCellModelData : function(data){
            // todo -- comment
            var self = this;
            setTimeout(function(){
                self.updateCellModelData(data);
            }, 0);
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
