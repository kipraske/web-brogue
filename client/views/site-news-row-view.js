define([
    "jquery",
    "underscore",
    "backbone"
], function ($, _, Backbone) {

    var SiteNewsRowView = Backbone.View.extend({
        tagName: "li",
        className: "site-news-row",

        template : _.template($('#site-news-row').html()),

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return SiteNewsRowView;

});