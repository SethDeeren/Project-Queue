
middleware = {
	checkAuthenticated: (req, res, next)=>{
		if(req.isAuthenticated()){
			return next();
		}
	
		res.redirect('/login');
	},
	checkNotAuthenticated: (req, res, next)=>{
		if(req.isAuthenticated()){
			return res.redirect('/');
		}
	
		next();
	}
	
}

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

module.exports = middleware;