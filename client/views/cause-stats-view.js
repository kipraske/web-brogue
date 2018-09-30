define([
    "jquery",
    "underscore",
    "backbone",
    "config"
], function ($, _, Backbone, config) {

    var CauseStatisticsView = Backbone.View.extend({

        el: '#cause-statistics',
        headingTemplate: _.template($('#cause-statistics-template').html()),

        events: {
            "click #deaths-by-cause-variant0" : "selectVariant0DeathCauseStats",
            "click #deaths-by-cause-variant1" : "selectVariant1DeathCauseStats",
            "click #deaths-by-cause-variant2" : "selectVariant2DeathCauseStats"
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
                        sortable: false,
                        editable: false
                    }, {
                        name: "rank",
                        label: "Rank",
                        cell: "integer",
                        sortable: false,
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

            this.setDeathCauseStatsForVariant(0);
            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({}));

            $("#cause-stats-grid").append(this.grid.render().$el);
            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        },

        selectVariant0DeathCauseStats: function(event) {

            event.preventDefault();

            this.setDeathCauseStatsForVariant(0);
            this.refresh();
        },

        setDeathCauseStatsForVariant: function(variantNo) {
            this.model.setVariantForCauseStats(config.variants[variantNo].code);
        },

        selectVariant1DeathCauseStats: function(event) {

            event.preventDefault();

            this.setDeathCauseStatsForVariant(1);
            this.refresh();
        },

        selectVariant2DeathCauseStats: function(event) {

            event.preventDefault();

            this.setDeathCauseStatsForVariant(2);
            this.refresh();
        },
    });

    return CauseStatisticsView;
});

