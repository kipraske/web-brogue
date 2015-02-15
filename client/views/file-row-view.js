define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {

    var FileRowView = Backbone.View.extend({
        tagName: "tr",
        className: "file-row",
        events : {
        },
        
        template : _.template($('#file-row').html()),
        
        render: function() {
            this.model.formatModifiedDate();
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return FileRowView;

});



