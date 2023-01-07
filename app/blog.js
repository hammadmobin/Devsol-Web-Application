var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var express  = require('express');
var router  = express.Router();


router.get("/", function(req, res){
    connection.query("Select * from blogs,blogusers,users where users.id = blogusers.userid and blogs.blogID = blogusers.blogid",[],function(err, rows){
        if(err){
            res.send(err);
        }
        else{
            console.log(rows);
            res.render("blogs/blog",{blogs:rows})
        }
    });
    // res.render("blogs/blog");
});


router.post("/",isLoggedIn, function(req, res){
    // get data from form and add to paintings array
         var insertQuery = "INSERT INTO blogs ( title, content, image) values (?,?,?)";
         var ts = new Date().getTime()
            connection.query(insertQuery,[req.body.title,req.body.description, req.body.image],function(err, rows) {
            if(err){
                res.send(err);
            }
            else{
                var blogid = rows.insertId;
                var userid = req.user.id;
                var insertQuery2 = "INSERT INTO blogusers ( blogid,userid) values (?,?)";

                connection.query(insertQuery2,[blogid,userid],function(err2, rows2) {
                    if(err2){
                        res.send(err2);
                    }
                    else{
                        
                        res.redirect("/blog/");
                    }
                });
            }
        });
});


router.get("/new", isLoggedIn, function(req, res){
  res.render("blogs/new"); 
});


router.get("/:id", function(req, res){

    connection.query("Select * from blogs,blogusers,users where blogs.blogID = ? and users.id = blogusers.userid and blogs.blogID = blogusers.blogid",[req.params.id],function(err, rows){
        if(err){
            res.send(err);
        }
        else{
            // res.send(rows);

            res.render("blogs/blogpage",{blogs:rows[0]})
        }
    });
});
// //destroy route
router.get("/:id/delete",isLoggedIn, function(req,res){
    connection.query("Delete from blogs where blogs.blogID=?",[req.params.id],function(err, rows){
        if(err){
            res.send(err);
        }
        else{
            console.log(rows);
            res.redirect("/blog/");
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

