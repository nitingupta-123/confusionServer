const express = require('express');
const dishRouter = express.Router();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')


dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })


    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
    })


dishRouter.route('/:dishId')

dishRouter.route('/:dishId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })



    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on ' + req.url);
    })


    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


dishRouter.route('/:dishId/comments')

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                // .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })



    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/'
            + req.params.dishId + '/comments');
    })


    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = dish.comments.length - 1; i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })




dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })


    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on ' + req.params.dishId + ' /comment' + req.params.commentId);
    })


    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {


                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    const currentUser = req.user._id;
                    const commentUser = dish.comments.id(req.params.commentId).author._id;
                    // console.log('current user id',req.user._id,'id of the user to whom comment belong',dish.comments.id(req.params.commentId).author);
                    if (JSON.stringify(currentUser) != JSON.stringify(commentUser)) {
                        const err = new Error('You are not authorized to update other comments!');
                        err.status = 403;
                        next(err);
                        return;
                    }
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    const currentUser = req.user._id;
                    const commentUser = dish.comments.id(req.params.commentId).author._id;
                    // console.log('current user id',req.user._id,'id of the user to whom comment belong',dish.comments.id(req.params.commentId).author);
                    if (JSON.stringify(currentUser) != JSON.stringify(commentUser)) {
                        const err = new Error('You are not authorized to update other comments!');
                        err.status = 403;
                        next(err);
                        return;
                    }
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            Dishes.findById(dish._id)
                                .populate('comments.author')
                                .then((dish) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(dish);
                                })
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = dishRouter;





// req -new -key MIICXQIBAAKBgQDQEA1gC4iPGp13vdoN/oEtAyYIBOVe4yiXTKQ0CLlqGMOQbGxPQ93BeaLLPnL5i72MpZbOyIQ3MT2yPygUkrlG8P9vGIX27aGZUe8DJsWcown2G13GKvFXgiVEIq8YEBrvg2nMba/SODeh05Eu5nfdt2rUUF5VSYvxoV8pu7oFWwIDAQABAoGBAMtlVd31iGr1Bske9ILHsPoS4OPn/V60TGMUDlW7zZ5VVSDjjUIzwx43TZjIlNc073kGC5ZcWTwnS/vrV8A86xcWRS3HQNmU9bkUUsMTEpA5egD/vHpHGIrfiHLiqIqKQ9edx/NfLMbFMEcfhoyfeJStid3TwIT/cwlhmwxpqZAxAkEA76ytdbEJ9woiUWE9lXRqSsNenvr0qqdzAl61I+quYXS5k8dIKzIl3+jWEkhU0X8rB5w8dWJk+WkWCV/7Vz7wQwJBAN48JNSa6TlTF58wOFgaPrg/EdjJkRYVpLWoba5/YFUxgV3aadvep+nqSK1RnDDNMOHVG+Dz1xdwezAm3A9ScQkCQEomrnPfFiosJHnxD9CRd+ExmLCvC8tQizCMhJZcIR9dsZya5yUWGsmvi6uUXUmDgpiUKdBXZM4VSRAVdfmEK2kCQFgDU8bLjyA/0zQdYcMqqbpIaCYGNiqb6b5z9PRNx/YVhBmKXbBRLwkJ2zyg/I2rRfe6ca8WgxHqXy9DxJVg3hkCQQCtZDaa6BCIktQ1g3QMEHf50x3T1P9QCqMQ3GEi55EOJAiY+oOwIUgAXm6I+qYD6Sklkk507U5KuOy8QXrKk/S6 -out cert.csr