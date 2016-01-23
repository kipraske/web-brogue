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
                "date": new Date(2016, 0, 23, 0, 0, 0),
                "description": "Anonymous users now have names and can watch recordings"
            });
            this.add(note);
            var note = new SiteNews();
            note.set({
                "date": new Date(2016, 0, 12, 0, 0, 0),
                "description": "Fixed score wrapping bug which affected scores above 65535. Guess why I never noticed this :)"
            });
            this.add(note);
            var note = new SiteNews();
            note.set({
                "date": new Date(2016, 0, 12, 0, 0, 0),
                "description": "Closing a watched recording now exits - you don't need to press Q"
            });
            this.add(note);

        }
    });

    return SiteNewsCollection;

});