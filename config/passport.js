var LocalStrategy   = require('passport-local').Strategy;
var faker = require('faker');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });


    passport.use(
        'local-signup',
        new LocalStrategy({

            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) {
            // console.log(req.body.username)
            if(req.body.password!=req.body.password_confirm){
                return done(null, false, req.flash('signupMessage', 'Passwords dont match.'));
            }

            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {

                    var newUserMysql = {
                                                username: req.body.username,
                                                password:  req.body.password,
                                                email:  req.body.email,
                                                name:  req.body.name,
                                                profession:  req.body.proffession,
                                                location:  req.body.location,
                                                hourlyrate:  req.body.hourlyrate,
                                                about:  req.body.about
                                            };
                                            
                    var insertQuery = "INSERT INTO users ( username, password, email, name, profession, location, hourlyrate, about ) values (?,?,?,?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,newUserMysql.email,newUserMysql.name, newUserMysql.profession,newUserMysql.location,newUserMysql.hourlyrate, newUserMysql.about],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'User not found')); 
                }

           
                if (password != rows[0].password)
                    return done(null, false, req.flash('loginMessage', 'Password wrong'));

          
                return done(null, rows[0]);
            });
        })
    );
};