//export POSTGRES_USER=postgres
//export POSTGRES_PASSWORD=TTPsuccess3*
// postgres:TTPsuccess3*

// must install express, pg, body-parser, ejs,

var express = require('express'); //acquire express library folder
var pg = require('pg'); //acquire a server and pg library folder // pg is the database adaptor
var bodyParser = require('body-parser'); //acquire body-parser library folder

var app = express(); //just to use only one function 'express()', which is express.js in the express folder, everytime app is called

var port = process.env.PORT || 3000; //for setting up database in Heroku database instead of using database from my machine

app.set('view engine', 'ejs'); //setting view engine for template using ejs
app.set('views', './views');

//bodyParser for parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));
// app.use(bodyParser());

// var dbURL = 'postgres://'+ process.env.POSTGRES_USER +':'+ process.env.POSTGRES_PASSWORD +'@localhost:5432/bulletinb';
//setting environment variable. You could also do this in your system setting

app.get('/', function(req, res){
  // pg.connect(dbURL, function(err, client, done){
  // below is for setting up database in Heroku database instead of using database from my machine
  // res.send("Hello");
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    if (err){
      return console.log("errorConnecting");
    }
    client.query(`select * from messages`, function(err, result){
      if (err){
        return console.log("errorGettingMessages");
      }
      res.render("home", result);
      done();
      // pg.end();
    });
  });
});

app.get('/messages', function(req, res){
  // below is for setting up database in Heroku database instead of using database from my machine
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    if (err){
      return console.log("errorConnecting");
    }
    client.query(`select * from messages`, function(err, result){
      if (err){
        return console.log("errorGettingMessages");
      }
      res.render("mBoard", result);
      done();
      // pg.end();
    });
  });
});

app.get("/write", function(req, res){
  res.redirect("/");
});

app.post("/write", function(req, res){
  // below is for setting up database in Heroku database instead of using database from my machine
  pg.connect(process.env.DATABASE_URL, function(err, client, done){
    // console.log("before client.query");
    if (err){
      return console.log("errorPosting");
    }
    client.query("`insert into messages (email, title, body) values ('" +req.body.email + "','" + req.body.title + "','" + req.body.body + "');`", function(err,result){
      //(`insert into messages (email, title, body) values ('`+ req.body.email + `','` + req.body.title + `','` + req.body.body +`');`
      // values ('${req.body.email}','${req.body.title}','${req.body.body}');`
      if (err){
        return console.log("errorWriting");
      }
      res.redirect("/messages");
    });
  });
});

// app.listen(3000, function(){
app.listen(port, function(){
  console.log("Listening on port_3000");
});
