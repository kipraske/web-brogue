// Model for a list of high scores

define([
    'jquery',
    'underscore',
    'backbone',
    'models/site-news',
    'moment'
], function($, _, Backbone, SiteNews, Moment) {

    var SiteNewsCollection = Backbone.Collection.extend({

        addDefaultData: function() {
            var note = new SiteNews();
            note.set({
                "date": new Date(2016, 1, 8, 21, 15, 0),
                "description": "No news is gnus news"
            });
            this.add(note);
        }
    });

    return SiteNewsCollection;

});