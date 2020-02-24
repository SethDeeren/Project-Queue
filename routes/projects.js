const express = require("express");
const router  = express.Router();
const middleware = require('../middleware');
const connection = require('../database');

router.get('/projects', (req, res)=>{
	console.log(Number(req.query.search));
	let query;
	if(isNaN(Number(req.query.search))){
		console.log("not a number");
		query = "SELECT * FROM projects WHERE author LIKE '%"+ req.query.search + "%' OR title LIKE '%"+ req.query.search + "%';"
	} else if(Number(req.query.search) !== 0){
		console.log("is a number");
		query = "SELECT * FROM projects WHERE id=" +Number(req.query.search) +";"
	}else{
		query = "SELECT * FROM projects;"
	}
	
	
	let projects = [];
	
	
		connection.query(query,(error, results)=>{
			if(error) throw error;
			
			results.forEach((project)=>{
				console.log(project);
				projects.push(project);
			});
			
			
			
			
			res.render('searchResults',{projects:projects});
			//res.send('projects');
		});
});

//NEW PROJECT FORM GET ROUTE
router.get('/projects/new', middleware.checkAuthenticated, (req, res)=>{
	res.render('newProject');
});

//POST ROUTE
router.post('/projects', (req,res)=>{
	let project = { title: req.body.project.title,
					author: req.body.project.author,
					description: req.body.project.description,
					group_num:  req.body.project.numOfGroups,
					group_size: req.body.project.groupSize
				}


	let postGroups = function (){
		connection.query('SELECT * FROM projects ORDER BY created_at DESC LIMIT 1;', (error, result)=>{
			if (error) throw error;
			let project_id = result[0].id;
			let que = 'INSERT INTO groups (id, project_id) VALUES ?';
			let values = [];
			for (let i = 0; i < req.body.project.numOfGroups; i++){
				values.push([i, project_id]);	
			}
			connection.query(que, [values], (error, result)=>{
				if(error) throw error;

				console.log(values);
				res.redirect('/');
			});

		});
	}

	let postProject = function (callback){
		connection.query('INSERT INTO projects SET ?',project, (error, results)=>{
			if(error) throw error;
		 });
		callback();

	}

	postProject(postGroups);

});

//SHOW ROUTE TO PROJECT

router.get('/projects/:id', (req,res)=>{
	let q = 'SELECT * FROM projects JOIN groups ON projects.id = groups.project_id left JOIN members ON members.group_id = groups.id and members.project_id = projects.id WHERE projects.id = ' + req.params.id;
	
	 let q1 = 'SELECT '
	 let q2 = '';
	 let q3 = 'FROM projects LEFT JOIN groups ON projects.id = groups.project_id LEFT JOIN members  ON members.group_id = groups.id WHERE projects.id = ' + req.params.id;
	
	console.log(req.params.id);
	
	 

			connection.query(q,  (error, results)=> {
			 if(error) throw error;	
			 let groups = [];
				
			results.forEach((result)=>{
				let group = [];
				console.log(result);
				groups.push({notes: "", group: group});
			});
				
			Object.keys(results).forEach((key)=> {

				if(results[key].name != null && results[key].name != ''){
					groups[results[key].group_id].notes = results[key].groupNotes;
					groups[results[key].group_id].group.push({name: results[key].name, notes: results[key].notes});
				}

			 });	
			
			 
				console.log(results[0]);
			// console.log(groups);
			// console.log(req.params.id);
				
				
				
			 res.render('showProject', {
			 id: req.params.id,
			 title: results[0].title,
			 author: results[0].author,
			 description: results[0].description,
			 groupNum: results[0].group_num,
			 groupSize: results[0].group_size,
			 groups: groups
			 });
		
	})
	
	 
});


	
router.post("/projects/:id", (req, res) => {
	console.log('put route');
   let que = "INSERT INTO members SET ?";
	
	let values = {  name: req.body.group.member,
					group_id:req.body.group.number,
					project_id:req.params.id,
				    notes: req.body.group.memberNotes
				};
	
	connection.query(que, values, (error, results)=>{
		if(error) throw error;
		res.redirect('/projects/'+ req.params.id);
	});
	// console.log("que" + que);
	// res.send(que);
});

//EDIT ROUTE
//needs updating and some middle ware check authenticated
router.get("/projects/:id/edit", middleware.checkAuthenticated, function (req, res) {

});

//UPDATE ROUTE
router.put("/projects/:id", (req, res) => {
	console.log('put route');
   let que = "UPDATE members SET name = '" + req.body.group.editMember + "', notes = '" + req.body.group.memberNotes + "' WHERE group_id = " + req.body.group.number + " AND project_id = " + req.params.id + " AND name = '" + req.body.group.member + "';";
	
	
	
	connection.query(que,  (error, results)=>{
		if(error) throw error;
		res.redirect('/projects/'+ req.params.id);
	});
	// console.log("que" + que);
	// res.send(que);
});


//DELETE ROUTE
router.delete("/projects/:id",middleware.checkAuthenticated, (req, res) => {
    let que = 'DELETE FROM projects WHERE id = ?';
	
	//res.send(que);
	connection.query(que,req.params.id, (error, results)=>{
		if(error) throw error;
		res.redirect('/projects');
	});
});

module.exports = router;