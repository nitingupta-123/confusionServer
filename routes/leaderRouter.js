const express=require('express');
const leaderRouter=express.Router();
const bodyParser=require('body-parser')

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})
.get((req,res,next)=>{
    res.end('Will send all the leader to you!');
})

.post((req,res,next)=>{
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on '+req.url);
})

.delete((req,res,next)=>{
    res.end('Deleting all leader');
})

leaderRouter.route('/:leaderId')

.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})

.get((req,res,next)=>{
    res.end('Will send all the leaders to you!' + req.params.leaderId);
})

.post((req,res,next)=>{
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description +' ' + req.params.leaderId);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader'+req.url);
})

.delete((req,res,next)=>{
    
    res.end('Deleting all leader '+ req.params.leaderId);
})

module.exports=leaderRouter;
