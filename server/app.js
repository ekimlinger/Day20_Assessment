var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require("pg");
var zooRouter = require('./routes/zoo.js');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo_DB';
}

pg.connect(connectionString, function(err, client, done){
  if(err){
    console.log('Error connecting to the DB: ', err);
  } else{
    var query = client.query(
      'CREATE TABLE IF NOT EXISTS animal_table(' +
      'id SERIAL PRIMARY KEY,' +
      'species varchar(100) NOT NULL,' +
      'ammount INTEGER NOT NULL);'
    );
    query.on('end', function(){
      done();
      console.log('Ensured that animal_table exists');
    });
    query.on('error', function(){
      done();
      console.log('Error creating animal_table');
    });
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/animal", zooRouter);

app.set("port",(process.env.PORT || 3000));

app.get("/*", function(req, res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"/public", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
