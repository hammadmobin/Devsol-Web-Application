var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection); 
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app,passport) {

	app.get('/hire',isLoggedIn, function(req, res) {

        res.render('hire');

    });


	app.get('/addjob',isLoggedIn, function(req, res) {

        res.render('addjob');

    });

    app.get('/contract',isLoggedIn, function(req, res) {

        res.render('contract');

    });

    app.get('/courses', function(req, res) {

        res.render('courses');

    });

    app.get('/dashboard',isLoggedIn, function(req, res) {

        res.render('dashboard');

    });

    app.get('/deposits',isLoggedIn, function(req, res) {

        res.render('deposits');

    });

    app.get('/editprofile',isLoggedIn, function(req, res) {

        res.render('editprofile');

    });

    app.get('/file',isLoggedIn, function(req, res) {

        res.render('file');

    });

    app.get('/jobpost',isLoggedIn, function(req, res) {

        res.render('jobpost');

    });

    app.get('/jobsposted', function(req, res) {

        res.render('jobsposted');

    });

    app.get('/link',isLoggedIn, function(req, res) {

        res.render('link');

    });

    app.get('/messages',isLoggedIn, function(req, res) {

        res.render('messages');

    });

    app.get('/offers',isLoggedIn, function(req, res) {

        res.render('offers');

    });

    app.get('/password',isLoggedIn, function(req, res) {

        res.render('password');

    });

    app.get('/payment',isLoggedIn, function(req, res) {

        res.render('payment');

    });

    app.get('/profile',isLoggedIn, function(req, res) {

        res.render('profile');

    });

    app.get('/profileimage',isLoggedIn, function(req, res) {

        res.render('profileimage');

    });

    app.get('/rate',isLoggedIn, function(req, res) {

        res.render('rate');

    });

    app.get('/task',isLoggedIn, function(req, res) {

        res.render('task');

    });

    app.get('/viewoffer',isLoggedIn, function(req, res) {

        res.render('viewoffer');

    });

    app.get('/viewproposal',isLoggedIn, function(req, res) {

        res.render('viewproposal');

    });

    app.get('/withdrawals',isLoggedIn, function(req, res) {

        res.render('withdrawals');

    });


    app.get('/work',isLoggedIn, function(req, res) {

        res.render('work');

    });
    app.get('/workroom',isLoggedIn, function(req, res) {

        res.render('workroom');

    });





};    
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

