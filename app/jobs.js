var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var express  = require('express');
var router  = express.Router();


router.get("/applied", function(req, res){
    res.render("applied");
});




//middleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}


module.exports = router;