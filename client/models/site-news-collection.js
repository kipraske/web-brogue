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
                "date": new Date(2016, 2, 25, 0, 0, 0),
                "description": "Try my 2016 7DRL <a href='http://flend.net/northerly'>Becoming Northerly</a>!"
            });
            this.add(note);
            var note = new SiteNews();
            note.set({
                "date": new Date(2016, 2, 25, 0, 0, 0),
                "description": "Mouseover enabled (thanks to bleezy)"
            });
            this.add(note);
        }
    });

    return SiteNewsCollection;

});