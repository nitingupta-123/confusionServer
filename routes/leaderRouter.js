const express = require('express');
const leaderRouter = express.Router();
const bodyParser = require('body-parser')
const Leaders = require('../models/leader');
var authenticate = require('../authenticate');
const cors = require('./cors');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })


    .get(cors.cors,(req, res, next) => {
        Leaders.find({})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                console.log('Dish Created', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on ' + req.url);
    })

    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Leaders.remove({})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        })
    })

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })


    
    .get(cors.cors,(req, res, next) => {
        Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description + ' ' + req.params.leaderId);
    })

    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
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

    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Leaders.findByIdAndRemove(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = leaderRouter;
