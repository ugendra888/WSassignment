const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const mongo= require('mongodb').MongoClient;
host="mongodb://localhost:27017";
const multer= require('multer');
const upload= multer();
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'Views')))


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('access-Control-Allow-Origin', '*');
  next();
  });


app.get('/',(req,res)=>{
 res.redirect("createview.html");
});
app.post("/createPost",upload.fields([]),(req,res)=>{
var created="false";
mongo.connect(host,(err,client)=>{
    if(err) throw err;
    else{
        var db=client.db('14IT154');
      db.collection('posts').insertOne(req.body,(err)=>{
            if (err) {
                if(err.errmsg.indexOf("duplicate key error")>-1){
                    created="duplicate key"
                }
            }
            else{created="true";}
            res.send(created);
      });
    }
}) 
    
});

app.get('/getAllPosts',(req,res)=>{
    mongo.connect(host,(err,client)=>{
        if(err) throw err;
        else{
            var db=client.db('14cs140');
          db.collection('posts').find().toArray((err,posts)=>{
                if (err) throw err;
                else{
                    res.json(posts);
                }
                
          });
        }
    }) 
});

app.get('/getPost/:id',(req,res)=>{
    mongo.connect(host,(err,client)=>{
        if(err) throw err;
        else{
            var db=client.db('14IT154');
          db.collection('posts').findOne({"_id":req.params.id},(err,post)=>{
                if (err) throw err;
                else{
                    res.json(post);
                }
                
          });
        }
    }) 
});


app.post("/updatePost",upload.fields([]),(req,res)=>{
    var updated="false";
    mongo.connect(host,(err,client)=>{
        if(err) throw err;
        else{
            var db=client.db('14IT154');
          db.collection('posts').updateOne({"_id":req.body._id},{"$set":req.body},(err)=>{
                if (err) throw err;
                else{updated="true";}
                res.send(updated);
          });
        }
    }) 
        
    });

// Get port from environment.
 
const port = process.env.PORT || '3000';

app.set('port', port);

//Create HTTP server.
const server = http.createServer(app);

//Listen on port
server.listen(port, () => console.log("listening on port 3000"));