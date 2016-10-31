define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    var LevelStatisticsView = Backbone.View.extend({

        el: '#level-statistics',
        headingTemplate: _.template($('#level-statistics-template').html()),

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.grid = new Backgrid.Grid({
                columns: [
                    {
                        name: "level",
                        label: "Level",
                        cell: "integer",
                        sortable: false,
                        editable: false
                    }, {
                        name: "frequency",
                        label: "Frequency",
                        cell: "integer",
                        sortable: false,
                        editable: false
                    }],

                collection: this.model
            });

            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({}));

            $("#level-stats-grid").append(this.grid.render().$el);
            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        }
    });

    return LevelStatisticsView;
});

