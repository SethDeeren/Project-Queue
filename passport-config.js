const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById){
	
	const authenticateUser = async (email, password, done)=>{
		
		const user = getUserByEmail(email);
		if(user == null){
			return done(null, false, {message: 'No user with that email. To start a project create an account'})
		}
		
		try{
			if (await bcrypt.compare(password, user.password)){
				return done(null, user)
			}else{
				return done(null, false, {message: 'password does not match.'})
				
			}
			
			
		}catch(e){
				
			return done(e)
		}
		
		
	}
	
	passport.use(new localStrategy({usernameField: 'email'}, authenticateUser));
	passport.serializeUser((user, done)=> done(null, user.id));
	passport.deserializeUser((id, done)=>{ 
	
		return done(null, getUserById(id))
	});
	
	
}

module.exports = initialize;