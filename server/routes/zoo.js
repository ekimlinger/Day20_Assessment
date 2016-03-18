var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var randomRoute = require('./random.js');

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/zoo_DB';
}

router.get("/", function(req,res){
  pg.connect(connectionString,function(err,client,done){
    if(err){
      done();
      console.log("Error getting from DB");
      res.status(500).send(err);
    } else{
      console.log("Attempting to get from db");
      var result = [];
      var query = client.query('SELECT * FROM animal_table;');
      query.on('row', function(row){
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        res.send(result);
      });
    }
  });
});
router.post("/", function(req,res){
  pg.connect(connectionString,function(err,client,done){
    if(err){
      done();
      console.log("Error getting from DB");
      res.status(500).send(err);
    } else{
      console.log("Attempting to write to db");
      var result = [];
      var randomNumber = randomRoute(1, 100);
      var species = req.body.species;
      console.log(species);
      var query = client.query(
                              'INSERT INTO animal_table '+
                              '(species, ammount) '+
                              'VALUES($1, $2);',
                              [req.body.species, randomNumber]);
      query.on('row', function(row){
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
      query.on('end',function(end){
        done();
        console.log(result);
        res.send(result);
      });
    }
  });
});

module.exports = router;
