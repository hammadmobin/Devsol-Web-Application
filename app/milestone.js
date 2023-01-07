var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var express  = require('express');
var router  = express.Router();


router.get("/", function(req, res){
    connection.query("Select * from milestone",[],function(err, rows){
        if(err){
            res.send(err);
        }
        else{
            console.log(rows);
            res.render("milestone",{milestones:rows})
        }
    });
});
router.post("/",isLoggedIn, function(req, res){
         var insertQuery = "INSERT INTO milestone ( name, startdate, enddate, budget) values (?,?,?,?)";
            connection.query(insertQuery,[req.body.name,req.body.startdate, req.body.enddate, req.body.budget],function(err, rows) {
            if(err){
                res.send(err);
            }
            else{
                    res.redirect("milestone");
            }
        });
});


//middleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}


module.exports = router;
