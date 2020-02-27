if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const mysql = require('mysql');
const express = require('express');
const bodyParser  = require("body-parser");
const app = express();
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');

//Routes
const projectRoutes = require('./routes/projects'),
	  groupRoutes = require('./routes/groups'),
	  memberRoutes = require('./routes/members'),
	  indexRoutes = require('./routes/index')


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
	
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/public", express.static("public"));
app.use(methodOverride("_method"));




app.use(indexRoutes);
app.use(projectRoutes);


// Future way of splitting route right now anthing other then index routes is in project routes

//app.use("/", indexRoutes);
//app.use("/projects",projectRoutes);
//app.use("/projects/:id/group", groupRoutes);
//app.use("/projects/:id/group/:id/member", memberRoutes);

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
 console.log('App listening on port 3000!');
});
