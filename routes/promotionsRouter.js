const express = require('express');
const promotionRouter = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promos = require('../models/promo');
var authenticate = require('../authenticate');



promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
    // .all((req,res,next)=>{
    //     res.statusCode=200;
    //     res.setHeader('Content-Type','text/html');
    //     next();
    // })
    .get((req, res, next) => {

        Promos.find({})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.create(req.body)
        .then((promo) => {
            console.log('Dish Created', promo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on promotions');
    })

    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.remove({})
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        })
    })

promotionRouter.route('/:promotionId')

    // .all((req, res, next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     next();
    // })

    .get((req, res, next) => {
        Promos.findById(req.params.promotionId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on ' + req.params.promotionId);
    })

    .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndUpdate( req.params.promotionId, {
            $set: req.body
        }, { new: true })
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndRemove(req.params.promotionId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = promotionRouter;
