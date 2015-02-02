define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "models/user"
], function ($, _, Backbone, send, UserModel) {

    var HeaderView = Backbone.View.extend({
        el: "header",
        userModel: new UserModel(),

        events: {
            "click #logout": "logout"
        },
        
        template: _.template($('#welcome').html()),
        
        initialize: function () {
            this.render();
        },
        render: function () {
            console.log("rendered... kind of");
        },
        
        logout: function() {
            
            // TODO - actually log out.
            
            console.log("pretend logged-out");
        },
        
    });

    return HeaderView;

});


