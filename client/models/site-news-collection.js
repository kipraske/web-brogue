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
                "date": new Date(2016, 1, 12, 0, 0, 0),
                "description": "Fixed score wrapping bug which affected scores above 65535. Guess why I never noticed this :)"
            });
            this.add(note);
        }
    });

    return SiteNewsCollection;

});