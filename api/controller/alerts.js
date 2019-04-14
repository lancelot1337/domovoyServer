const mongoose = require('mongoose');
const Alert = require('../models/alert')

exports.alerts_get_all = (req, res, next) => {
    Alert.find()
        .select('_id machineID result probability')
        .exec()
        .then(alerts => {
            const response = {
                count: alerts.length,
                alerts: alerts.map(alert => {
                    return {
                        _id: alert._id,
                        machineID: alert.machineID,
                        result: alert.result,
                        probability: alert.probability,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/alert/' + alert._id
                        }
                    }
                })
            }
            // if(alerts.length >= 0){
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


exports.alerts_post = (req, res, next) => {
    req.body.results.map(result => {
        const alert = new Alert({
            _id: new mongoose.Types.ObjectId(),
            machineID: result.machineID,
            result: result.result,
            probability: result.probability
        });
        alert.save()
            .then(result => {
                console.log(result);
                // res.redirect('/user')
                // res.status(201).json({
                //     message: "Created alert successfully",
                //     createdAlert: {
                //         _id: result._id,
                //         machineID: result.machineID,
                //         request: {
                //             type: 'GET',
                //             url: 'http://localhost:3000/alert/' + result._id
                //         }
                //     }
                // });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    })
    res.redirect('/user')

};

exports.alerts_get_single = (req, res, next) => {
    const id = req.params.id;
    Alert.findById(id)
        .select('_id machineID')
        .exec()
        .then(alert => {
            console.log(`From DB: ${alert}`);
            if (alert) {
                res.status(200).json({
                    alert: alert,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/alert/'
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

exports.alerts_patch = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const key in req.body) {		//or const key of Object.keys(req.body)
        updateOps[key] = req.body[key];
    }

    Alert.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Alert updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/alert/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.alerts_delete = (req, res, next) => {
    const id = req.params.id;
    Alert.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Alert deleted!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/alert/',
                    body: {
                        machineID: "String"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({ error: err });
        });
};