const express = require("express");
const router  = express.Router(); 
const passport = require("passport");
const bcrypt = require('bcrypt');
const initializePassport = require('../passport-config');
const middleware = require('../middleware');
const connection = require('../database');

initializePassport(
	passport,
	email => users.find(user => user.email === email),
	id =>  users.find(user => user.id === id)
);

let users = [];
console.log(users);

// LANDING REDIRECTS TO INDEX, NO LANDING IDEAS YET
router.get('/', (req, res)=>{
	res.render('landing');
});

router.get("/login",middleware.checkNotAuthenticated, (req, res)=>{
	res.render("login");
});

router.post("/login", middleware.checkNotAuthenticated, passport.authenticate('local',{
	successRedirect: "/projects/new",
	failureRedirect: "/login",
	failureFlash: true
}));



router.get("/register", middleware.checkNotAuthenticated, (req, res)=>{
	res.render('register');
});

router.post("/register",middleware.checkNotAuthenticated, async (req, res)=>{
	try{
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		users.push({
			id: Date.now().toString(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		});
		
		res.redirect('/login');
	}catch{
		console.log("here");
		res.redirect('/register');
	}
	console.log(users);
});

router.get("/logout", (req, res)=>{
	req.logout();
	res.redirect('/');
});

// function checkAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
	
// 	res.redirect('/login');
// }

// function checkNotAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return res.redirect('/');
// 	}
	
// 	next();
// }

module.exports = router;