var passport = require('passport');

function authenticateUser(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.write('login failed');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            /*
            users[user.userName] = {
                status : "connected",
                viewing : "lobby",
                broguePID : -1
            };
            */
           
            return res.write('login success');
        });
    })(req, res, next);
 }
 
module.exports = authenticateUser;
