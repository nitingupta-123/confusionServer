const express=require('express');
const dishRouter=express.Router();
const bodyParser=require('body-parser')

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})

.get((req,res,next)=>{
    res.end('Will send all the dishes to you!');
})


.post((req,res,next)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})


.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})


.delete((req,res,next)=>{
    res.end('Deleting all dishes');
})


dishRouter.route('/:dishId')

.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})


.get((req,res,next)=>{
    res.end('Will send details of the dishes:' + req.params.dishId + ' to you!');
})


.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on ' + req.url);
})


.put((req,res,next)=>{
    
    res.write('Updating the dish: '+req.params.dishId);
    res.end('Will update the dish '+req.body.name + ' with description: '+ req.body.description);
})


.delete((req,res,next)=>{
    
    res.end('Deleting dishes:'+req.params.dishId);
})

module.exports=dishRouter;
