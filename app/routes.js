var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection); 
var bcrypt = require('bcrypt-nodejs');



module.exports = function(app,passport) {


    app.get('/',function(req,res){
            res.render('index');  
        });

    app.get('/login', function(req, res) {

        res.render('login',{ message: req.flash('loginMessage') });

    });

    app.get('/signup', function(req, res){
        res.render('signup',{message: req.flash('signupMessage')});
      });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash : true 
    }));

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', 
            failureRedirect : '/login',
            failureFlash : true 
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


};

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
}

