define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    var StatisticsView = Backbone.View.extend({

        el: '#server-statistics',
        headingTemplate: _.template($('#stats-heading').html()),

        initialize: function() {

            this.refresh();
        },

        render: function() {

            this.$el.html(this.headingTemplate({ }));
            return this;
        },

        refresh: function() {
            this.render();
        }
    });

    return StatisticsView;

});

