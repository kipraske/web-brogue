define([
    "jquery",
    "underscore",
    "backbone",
    "moment"
], function ($, _, Backbone, Moment) {

    var SiteNewsRowView = Backbone.View.extend({
        tagName: "li",
        className: "site-news-row",

        template : _.template($('#site-news-row').html()),

        render: function() {

            var objectToRender = {
                date: this.formatDate(this.model.get("date")),
                description: this.model.get("story")
            };

            this.$el.html(this.template(objectToRender));
            return this;
        },
        formatDate: function(date) {
            return Moment(date).format('MMMM Do YYYY');
        }
    });

    return SiteNewsRowView;

});