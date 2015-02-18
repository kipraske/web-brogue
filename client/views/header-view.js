// View for the header that appears when logged in.  In the future may also contain things like user options.

define([
    "jquery",
    "underscore",
    "backbone",
    "dataIO/send-generic",
    "models/user"
], function ($, _, Backbone, send, UserModel) {

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
        
        setUserData : function(username){
            this.userModel.set({
                username : username
            })
            
            this.render();
            
            // TODO get session info to get the rest of the options and save in the user model
            
        },
        
        logout: function(e) {
            e.preventDefault();
            send("auth", "logout");
        },
        
    });

    return HeaderView;

});


