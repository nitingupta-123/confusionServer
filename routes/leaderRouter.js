const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser')
const Leaders = require('../models/leader');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    // .all((req,res,next)=>{
    //     res.statusCode=200;
    //     res.setHeader('Content-Type','text/html');
    //     next();
    // })
    .get((req, res, next) => {
        Leaders.find({})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                console.log('Dish Created', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on ' + req.url);
    })

    .delete((req, res, next) => {
        Leaders.remove({})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        })
    })

leaderRouter.route('/:leaderId')

    // .all((req, res, next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     next();
    // })

    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description + ' ' + req.params.leaderId);
    })

    .put((req, res, next) => {
        Leaders.findByIdAndUpdate( req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = leaderRouter;
