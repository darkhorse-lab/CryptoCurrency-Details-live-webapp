var express = require('express');
var router = express.Router();
var User = require('../models/user'); // Model import where "user.js" is a mongoose Model
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// ............
global.fetch = require('node-fetch');
const cc = require('cryptocompare');

// var Coins = {BTC:'BTC'}, {ETH:'ETH'}];
var coins = ['BTC', 'ETH', 'XRP', 'BCH', 'LTC', 'EOS', 'ADA', 'XLM', 'NEO', 'MIOTA', 'XMR', 'DASH', 'TRX', 'USDT', 'XEM', 'BNB', 'ETC', 'VEN', 'QTUM', 'XVG', 'LSK', 'OMG', 'ICX', 'NANO'];


var User = require('../models/user');


// Register
router.get('/register', function(req, res){
    res.render('register');
});

// HomePage
router.get('/home', function (req, res) {
    var username = "__";
    username = req.user.username;

    User.find({
        username: username
      }, function(err, results) {
        if (err) return console.error(err);

        console.log(results);

      });


  cc.priceMulti(coins, ['USD', 'EUR'])
  .then(prices => {

    console.log(prices);
    var keyNames = Object.keys(prices);
console.log(keyNames);
console.log("I have got prices values :D ");

console.log("I have got prices values :D ");
console.log("I have got prices values :D ");
console.log("I have got prices values :D ");

    res.render('index', {username: username, coinlist: keyNames, prices: prices});
  }).catch(console.error);

});

// Login
router.get('/login', function(req, res, next){
    res.render('login');
});

// Register User
router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation    "req.checkBody(name, msg).fun()""
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match!!').equals(req.body.password);

    ERRORS="";
    var errors = req.validationErrors();
    if(errors){
        res.render('register', {
            ERRORS: errors
        });
    }else{
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, user){  // etai user Model er "module.exports.createUser" line er code ta , jeta baire theke access korte parci ..
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'Registered Successfully!!');
        res.redirect('/users/login');

        // console.log('PASSED');
    }
    // console.log("name: "+name + " username: "+username+" email "+email+" password "+password + " password2 "+password2);
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}
			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserByID(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'Successfully logged out!!');
    res.redirect('/users/login');
});

module.exports = router;
