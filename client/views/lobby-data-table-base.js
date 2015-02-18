// Helper functions for our lobby rollup views with a table layout

define({
    
    /*
     * Define these properties in the parent. There will only be three of these so I am not going to bother using the Backbone inheritance model.  Just make sure that these are defined in the child View
     * 
    $tableElement - jQuery Object 
    tableSelector - string
    headingTemplate - underscore template object
    tableState - lobby-data-table-state model
    */
   
    renderHeading: function () {
        this.$el.html(this.headingTemplate({
            isEmpty: this.tableState.get("isEmpty")
        }));
    },
    renderHeadingOnEmptyChange: function () {
        var isEmpty = this.tableState.get("isEmpty");
        var oldIsEmpty = this.tableState.get("oldIsEmpty");
        
        if (isEmpty !== oldIsEmpty) {
            this.renderHeading();
            this.tableState.set("oldIsEmpty", isEmpty);

            if (!isEmpty) {
                this.$tableElement = this.$el.find(this.tableSelector);
            }
        }
    }
});

