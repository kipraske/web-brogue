define([
    "jquery",
    "underscore",
    "backbone",
    "config",
], function ($, _, Backbone, config) {

    var GeneralStatsView = Backbone.View.extend({

        el: '#general-statistics',
        headingTemplate: _.template($('#general-statistics-template').html()),

        events: {
            "click #general-stats-variant0" : "selectVariant0GeneralStats",
            "click #general-stats-variant1" : "selectVariant1GeneralStats"
        },

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.setGeneralStatsForVariant(0);
            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate(this.model.toJSON()));
            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        },

        selectVariant0GeneralStats: function(event) {

            event.preventDefault();

            this.setGeneralStatsForVariant(0);
            this.refresh();
        },

        setGeneralStatsForVariant: function(variantNo) {
            this.model.setVariantGeneralStats(config.variants[variantNo].code);
        },

        selectVariant1GeneralStats: function(event) {

            event.preventDefault();

            this.setGeneralStatsForVariant(1);
            this.refresh();
        }
    });

    return GeneralStatsView;

});

