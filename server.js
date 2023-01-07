var dbconfig = require('./config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = 3000 || process.env.PORT;
var passport = require('passport');
var flash = require('connect-flash');
var blogRoutes = require("./app/blog");
var jobRoutes = require("./app/jobs");
var milestoneRoutes = require("./app/milestone");
const stripe = require('stripe')('sk_test_05WYYZyha1nLE9dRIhuiTcVx');

require('./config/passport.js')(passport);


app.use(morgan('newdev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'kodizimcoisrunning',
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/hireroutes.js')(app, passport);
app.use("/jobs", jobRoutes);
app.use("/blog", blogRoutes);
app.use("/milestone", milestoneRoutes);
app.get('/payment/pay', (req, res) => {
    res.render("jobs/payment")
});
app.post('/payment/pay', (req, res) => {
    console.log("heyyyy")
    // res.send(req.body);
    var cost = req.body.amount * 100;
    if (req.body.amount && req.body.amount >= 5) {
        stripe.charges.create(
            {
                amount: cost,
                currency: 'usd',
                source: 'tok_mastercard',
                description: 'My First Test Charge (created for API docs)',
            },
            function (err, charge) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.send(charge)
                }
                // asynchronously called
            }
        );
    } else {
        res.send("amount munst be greater than $5")
    }
});

app.post("/payment/transfer", function (req, res) {

    stripe.transfers.create(
        {
            amount: 400,
            currency: 'usd',
            destination: 'acct_1DZYclLk1GINyAzx',
            transfer_group: 'ORDER_95'
        },
        function (err, transfer) {
            // asynchronously called
            if (err) {
                res.send(err);
            } else {
                res.send(transfer)
            }
        }
    );
});

// launch ======================================================================
app.listen(port, () => {
    console.log("server started @ port: " + port);
});
