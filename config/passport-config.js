var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models');

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
    // first is error, then how we want to pass on the data
});

passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: { email: email }
    }).then(function(user) {
        // want to detect if user is null (aka not found)
        // console.log(user.isValidPassword(password));
        if (!user || !user.isValidPassword(password)) {
            cb(null, false); // no user or bad password
        } else {
            cb(null, user); // user is allowed
        }
    }).catch(cb);
}));


module.exports = passport;
