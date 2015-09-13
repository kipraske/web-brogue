// View for the header that appears when logged in.  In the future may also contain things like user options.

define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "util",
    "dataIO/send-generic",
    "models/user"
], function ($, _, Backbone, dispatcher, util, send, UserModel) {

    var HeaderView = Backbone.View.extend({
        el: "#header",
        userModel: new UserModel(),

        events: {
            "click #logout": "logout"
        },
        
        template: _.template($('#welcome').html()),
        
        initialize: function () {

        },
        
        render: function () {
            this.$el.html(this.template(this.userModel.toJSON()));
        },
        
        login : function(username){
            this.userModel.set({
                username : username
            });

            this.render();
        },
        
        logout: function(e) {
            e.preventDefault();

            util.removeItem('sessionId');

            dispatcher.trigger("logout");

            send("auth", "logout");
        },
        
    });

    return HeaderView;

});


