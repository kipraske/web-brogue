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
        
        logout: function() {
            
            // TODO - actually log out.
            
            console.log("pretend logged-out");
        },
        
    });

    return HeaderView;

});


