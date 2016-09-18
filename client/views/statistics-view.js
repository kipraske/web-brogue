// Embedded high scores view

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher"
], function ($, _, Backbone, dispatcher) {

    var StatisticsView = Backbone.View.extend({

        el: '#server-statistics',
        headingTemplate: _.template($('#stats-heading').html()),

        events: {
            "click #stats-deaths-by-level" : "selectDeathsByLevel"
        },

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.grid = new Backgrid.Grid({
                columns: [
                    {
                        name: "level",
                        label: "Level",
                        cell: "integer",
                        sortable: true,
                        editable: false
                    }, {
                        name: "cause",
                        label: "Cause",
                        cell: "string",
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

            this.$el.html(this.headingTemplate({ }));

            $("#stats-grid").append(this.grid.render().$el);

            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        },

        selectDeathsByLevel: function(event) {

            event.preventDefault();
            this.refresh();
        }
    });

    return StatisticsView;

});

