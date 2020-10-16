const express=require('express');
const promotionRouter=express.Router();
const bodyParser=require('body-parser')

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})
.get((req,res,next)=>{

    res.end('Will send all the promotions to you!');
})

.post((req,res,next)=>{
    res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.description);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on promotions');
})

.delete((req,res,next)=>{
   
    res.end('Deleting all promotions');
})

promotionRouter.route('/:promotionId')

.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    next();
})

.get((req,res,next)=>{
    res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!');
})

.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on '+req.params.promotionId);
})

.put((req,res,next)=>{
    res.write('Updating the promotion: '+req.params.promotionId);
    res.end('Will update the promotions '+req.body.name + ' with description: '+ req.body.description);
})

.delete((req,res,next)=>{
    res.end('Deleting promotion:'+req.params.promotionId);
})

module.exports=promotionRouter;
