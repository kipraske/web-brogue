define([
    "jquery",
    "underscore",
    "backbone",
    'dataIO/send-keypress',
    "views/console-cell-view",
    "models/console-cell"
], function($, _, Backbone, sendKeypressEvent, ConsoleCellView, CellModel) {

    var _CONSOLE_ROWS = 34;
    var _CONSOLE_COLUMNS = 100;
    var _MESSAGE_UPDATE_SIZE = 9;

    var _consoleCells = [];
    var _consoleWidth;
    var _consoleHeight;
    var _consoleCellTopOffsetPercent;
    var _consoleCellLeftOffsetPercent;
    var _consoleCellWidthPercent;
    var _consoleCellHeightPercent;
    var _consoleCellCharSizePx;
    var _consoleCellCharPaddingPx;
    var _consoleCellAspectRatio = 0.53;  //TODO: set this via options model, reset via resize function, may wish to have an option to keep fixed size even if it means we have to drag it about

    // See BrogueCode/rogue.h for all brogue event definitions
    var KEYPRESS_EVENT_CHAR = 0;

    var Console = Backbone.View.extend({
        el: "#console",
        events: {
            "keypress" : "handleKeypress",
            "keydown" : "handleNonCharacterKeypress"
        },
        initialize: function() {

            //TODO: set console size based on options that are set
            // For now we will use the full settings

            this.$el.addClass("full-width");
            this.$el.addClass("partial-height");

            this.calculateConsoleSize();
            this.calculateConsoleCellSize();

            this.initializeConsoleCells();
        },
        initializeConsoleCells: function() {
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

                    this.$el.append(cellView.render().el);
                    column.push(cellView);
                }
                _consoleCells.push(column);
            }
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
            _consoleCellCharPaddingPx = cellPixelHeight / 5;
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
        
        updateCellModelData: function (data) {
            var dataArray = new Uint8Array(data);
            var dataLength = dataArray.length;
            var dIndex = 0;

            while (dIndex < dataLength) {
                var dataXCoord = dataArray[dIndex++];
                var dataYCoord = dataArray[dIndex++];

                _consoleCells[dataXCoord][dataYCoord].model.set({
                    char: dataArray[dIndex++],
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
        
        // For keys that produce a character in the console
        handleKeypress: function (event) {
            sendKeypressEvent(KEYPRESS_EVENT_CHAR, event.charCode, event.ctrlKey, event.shiftKey);
        },
        // For keys that don't produce a character - for example the escape key
        handleNonCharacterKeypress: function (event) {
            
            var isSpecialChar = false;
            var specialKeyCode = 0;

            switch (event.keyCode) {
                case 27 : // ESC_KEY
                    isSpecialChar = true;
                    specialKeyCode = 27;
            }

            if (isSpecialChar) {
                sendKeypressEvent(KEYPRESS_EVENT_CHAR, specialKeyCode, event.ctrlKey, event.shiftKey);
            }
        }
    });

    return Console;

});
