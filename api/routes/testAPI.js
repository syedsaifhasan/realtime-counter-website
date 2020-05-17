var express = require("express");
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://syedsaifhasan:syedsaifhasan@visitors-afarf.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(uri, function(err, client) {
  if(err) {
       console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
  }
  console.log('Connected...');

const collection = client.db("realtime_visitors").collection("users");

router.get('/', function(req, res, next) {
    collection.find().toArray(function(err, data){
      if(err) {
        console.log(err);
      }
      else {
        res.json(data)
      }
    });
  });

  // Enter New Data
  router.post('/create', function (req, res) {
    var query = req.body.data;
    collection.findOne({ip_address:query}, function(err, example){
        if(err) console.log(err);
        if (example){
            console.log("This has already been saved");
        } else {
          var newIP = {
            "ip_address": req.body.data
            };
      
          collection.insertOne(newIP, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted", newIP);
        });
        }
    });

  // Delete Data
  router.get('/delete', function(req, res, next) {
    collection.deleteOne({ ip_address : req.body.data }, function(err, example){
      if (err) console.log(err);
    });
  }); 

   res.status(201).json({"ip_address":req.body.data})
  })
});

module.exports = router;
