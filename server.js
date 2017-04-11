var morgan = require('morgan');
var path = require('path');
var express=require('express');

var Pool=require('pg').Pool;
var crypto=require('crypto');
var bodyParser=require('body-parser');

var config={
    user:'georgekunchattil1992',
    database:'georgekunchattil1992',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD //create environment variable
};

var app=express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(express.static('ui'));

app.get('/',function(req,res){
	res.sendFile(__dirname + '/ui/index.html');
});

app.get('/videos',function(req,res){
	res.sendFile(__dirname + '/ui/videos.html');
});

app.get('/works',function(req,res){
	res.sendFile(__dirname + '/ui/a.html');
});

app.get('/loginpage',function(req,res){
	res.sendFile(__dirname + '/ui/loginpage.html');
});

app.get('/updates',function(req,res){
	res.sendFile(__dirname + '/ui/project.html');
});

/* one way of including css
app.get('/css/style.css',function(req,res){
	res.sendFile(__dirname + '/css/style.css');
});*/

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a response with the results
    pool.query('SELECT*FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
    });
   
  
function createTemplate(data){
	var title=data.title;
	var date=data.date;
	var heading=data.heading;
	var content=data.content;

	var htmlTemplate=`
	<html>
  	<head>
  	<title>
  		${title}
  	</title>
  	<meta name="viewport" content="width=device-width, initial-scale=1"/>
  	</head>
  	<body>
  		<div>
  			<a href="/">Home</a>
  		</div>
  		<hr/>
  		<h3>
  			${heading}
  		</h3>
  		<div> 
  			${date.toDateString()}
  		</div>
  		<div>
  			${content}
  		</div>
  	</body>
	</html>
  `; 
  return htmlTemplate;

}

function hash(input,salt){
    //How do we create a hash?
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
    
    /*
    //algorithm md5
    //password->a8q2rasdfjq2ruqw9wxq029irxpmqoi3
    //password-this is some-random-string->c8q2rasdfjq2ruqowiuiqu32i4uijeiajdfajfkkajsdf
    //password-> "password-this-is-a-salt" -> <hash> -> <hash> x 10k times
    */
    
}

app.get('/hash/:input',function(req,res){
    var hashed=crypto.pbkdf2Sync(req.params.input,salt);
    res.send(hashedString);
});

//create user
app.post('/create-user', function(req,res){
   //username,password
   // {"username":"George", "password":"password"} 
   //JSON
   var username=req.body.username;
   var password=req.body.password;
   var salt=crypto.getRandomBytes(128).toString('hex');
   var dbString=hash(password,salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           res.send("User successfully created: " + username);
       }
   });
});

app.post('/login', function (req,res){
    var username=req.body.username;
    var password=req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username= $1', [username], function (err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           if(result.rows.length===0){
               res.send(403).send('username/password is invalid'); //status 403--> forbidden
           }
           else{
               //Match the password
               var dbString=result.rows[0].password;
               var salt=dbString.split('$')[2];
               var hashedPassword=hash(password,salt); //creating a hash based on the password submitted and the original salt
               if(hashedPassword===dbString){
                 res.send("credentials correct");
                 
                 //Set a session
                 
               }
               else{
                   res.send(403).send('username/password is invalid');
               }
        }
       }
   });
});

   //counter code
 var counter=0;
 app.get('/counter',function(req,res){
  counter=counter+1;
  res.send(counter.toString());
 });

 var names=[];
 app.get('/submit-name',function(req,res){
    //Get the name from the request
    var name=req.query.name;
    
    names.push(name);
    //JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
  });

//articles in dynamic format
  app.get('/articles/:articleName', function(req,res){
	//articleName==article-one
	//article(articleName={} content object for article-one
	
	 // SELECT * FROM articles WHERE title='';DELETE WHERE a='asdf'   ---> This will comment explains that it can delete contents of database by SQL Injection
	 //Best way to resolve this problem by using command SELECT * FROM articles WHERE title='\';DELETE WHERE a='\asdf'
	pool.query("SELECT * FROM article WHERE title= $1" + req.params.articleName + "'", function(err,result){
	    if(err){
	        res.status(500).send(err.toString());  //Status error
	    }
	    else{
	         if(result.rows.length===0){
	             res.status(404).send('Article not found');   //status not found
	         }
	         else{
	               var articleData=result.rows[0];
	               res.send(createTemplate(articleData));
	         }
	    }
	});
	
	
   });

 });
 
 

app.listen(8080,function(){
	console.log('app is listening on 8080 !');
});


/*Old Code 
var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={ 
   			'article-one':{
				title:"Article One | Tanmai Gopal",
				heading:'Article One',
				date:'Sep 5, 2016',
				content:`
				         <p>
  							This is the content of my first article. This is the content of my first article. This is the content of my first article. This is the content of my first article.
  						</p>
  						<p>
  							This is the content of my first article. This is the content of my first article. This is the content of my first article. This is the content of my first article.
  					   </p>
  					   <p>
  							This is the content of my first article. This is the content of my first article. This is the content of my first article. This is the content of my first article.
  					   </p>`
			},
			'article-two':{
				title:'Article Two | George Jacob',
				heading:'Article Two',
				date: 'Feb 5, 2017',
				content: `
				    <p>
  							This is the content of my second article. This is the content of my first article. This is the content of my first article. This is the content of my first article.
  					</p> `
			},
			'article-three':{
				title:'Article Three | George Jacob',
				heading:'Article Three',
				date: 'Feb 15, 2017',
				content: `
				    <p>
  							This is the content of my third article. This is the content of my first article. This is the content of my first article. This is the content of my first article.
  					</p> `
			}
 };
function createTemplate(data){
	var title=data.title;
	var date=data.date;
	var heading=data.heading;
	var content=data.content;

	var htmlTemplate=`
	<html>
  	<head>
  	<title>
  		${title}
  	</title>
  	<meta name="viewport" content="width=device-width, initial-scale=1"/>
  	</head>
  	<body>
  		<div>
  			<a href="/">Home</a>
  		</div>
  		<hr/>
  		<h3>
  			${heading}
  		</h3>
  		<div> 
  			${date}
  		</div>
  		<div>
  			${content}
  		</div>
  	</body>
	</html>
  `; 
  return htmlTemplate;

}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter=0;
app.get('/counter',function(req,res){
  counter=counter+1;
  res.send(counter.toString());
});

var names=[];
app.get('/submit-name',function(req,res){
    //Get the name from the request
    var name=req.query.name;
    
    names.push(name);
    //JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/:articleName', function(req,res){
	//articleName==article-one
	//article(articleName={} content object for article-one
	var articleName=req.params.articleName;
	res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});*/
