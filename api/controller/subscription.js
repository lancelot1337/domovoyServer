const mongoose = require('mongoose');
const Subscribe = require('../models/subscribe')

exports.subscribes_get_all = (req, res, next) => {
    Subscribe.find()
        .select('_id uid sid')
        .exec()
        .then(subscribes => {
            const response = {
                count: subscribes.length,
                subscribes: subscribes.map(subscribe => {
                    return {
                        _id: subscribe._id,
                        uid: subscribe.uid,
                        sid: subscribe.sid,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/subscribe/' + subscribe._id
                        }
                    }
                })
            }
            // if(subscribes.length >= 0){
            res.status(200).json(response);
            // } else{
            // 	res.status(404).json({message: "No entires found"})
            // }		
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


exports.subscribes_post = (req, res, next) => {
    const subscribe = new Subscribe({
        _id: new mongoose.Types.ObjectId(),
        uid: req.body.uid,
        sid: req.body.sid
    });
    subscribe.save()
        .then(result => {
            console.log(result);
            res.redirect('/tab-panel')
            // res.status(201).json({
            //     message: "Created subscribe successfully",
            //     createdSubscribe: {
            //         _id: result._id,
            //         uid: result.uid,
            //         request: {
            //             type: 'GET',
            //             url: 'http://localhost:3000/subscribe/' + result._id
            //         }
            //     }
            // });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.subscribes_get_single = (req, res, next) => {
    const id = req.params.id;
    Subscribe.findById(id)
        .select('_id uid sid')
        .exec()
        .then(subscribe => {
            console.log(`From DB: ${subscribe}`);
            if (subscribe) {
                res.status(200).json({
                    subscribe: subscribe,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/subscribe/'
                    }
                });
            } else {
                res.status(404).json({ message: "Requested data not found" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.subscribes_patch = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const key in req.body) {		//or const key of Object.keys(req.body)
        updateOps[key] = req.body[key];
    }

    Subscribe.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Subscribe updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/subscribe/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.subscribes_delete = (req, res, next) => {
    const id = req.params.id;
    Subscribe.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Subscribe deleted!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/subscribe/',
                    body: {
                        uid: "String"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({ error: err });
        });
};