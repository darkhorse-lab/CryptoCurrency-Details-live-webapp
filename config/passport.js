var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');

var bcrypt = require('bcrypt-nodejs');
var constant = require('../config/constants');
var dateFormat = require('dateformat');

//expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        User.findOne({ 'mail' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);
            if (user) {
                return done(null, false, req.flash('error', 'That email is already taken.'));
            } else {

           User.find().sort([['_id', 'descending']]).limit(1).exec(function(err, userdata) {
                // if there is no user with that email
                // create the user
                var newUser  = new User();

                // set the user's local credentials

           	  // var day =dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
           	  // var active_code=bcrypt.hashSync(Math.floor((Math.random() * 99999999) *54), null, null);
                    newUser.email    = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.name = req.body.name;
                    newUser.username = req.body.username;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser,req.flash('success', 'Account Created Successfully'));
                    req.session.destroy();
                });

              });

            }

        });

        });


    }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({ 'mail' :  email }, function(err, user) {
            if (err)
            return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata

            if(user.status === 'inactive')
             return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata


            // all is well, return successful user
            req.session.user = user;

            return done(null, user);
        });
    }));
};
