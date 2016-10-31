define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    var GeneralStatsView = Backbone.View.extend({

        el: '#general-statistics',
        headingTemplate: _.template($('#general-statistics-template').html()),

        initialize: function() {
            this.listenTo(this.model, "add", this.render);
            this.listenTo(this.model, "change", this.render);

            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate(this.model.toJSON()));
            return this;
        },

        refresh: function() {
            this.model.fetch();
            this.render();
        }
    });

    return GeneralStatsView;

});

