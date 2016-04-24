define([
    "jquery",
    "underscore",
    "backbone",
    "views/site-news-row-view"
], function ($, _, Backbone, SiteNewsRowView) {

    var SiteNewsView = Backbone.View.extend({

        el: '#site-news',
        $listElement: null,
        headingTemplate: _.template($('#site-news-heading').html()),

        initialize: function () {
            this.render();
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'add', this.render);

            this.model.fetch();
        },

        render: function() {

            var isEmpty = false;
            if(this.model && this.model.length == 0) {
                isEmpty = true;
            }
            if(!this.model) {
                isEmpty = true;
            }

            this.$el.html(this.headingTemplate({
                isEmpty: isEmpty
            }));

            this.$listElement = this.$el.find('#site-news-table');

            if(this.model) {
                this.model.each(function (model) {
                    var item = new SiteNewsRowView({model: model});
                    this.$listElement.append(item.render().$el);
                }, this);
            }

            return this;
        }
    });

    return SiteNewsView;

});