const mongoose = require('mongoose');
const Scheme = require('../models/scheme')

exports.schemes_get_all = (req, res, next) => {
    Scheme.find()
        .select('_id description')
        .exec()
        .then(schemes => {
            const response = {
                count: schemes.length,
                schemes: schemes.map(scheme => {
                    return {
                        _id: scheme._id,
                        description: scheme.description,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/scheme/' + scheme._id
                        }
                    }
                })
            }
            // if(schemes.length >= 0){
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


exports.schemes_post = (req, res, next) => {
    const scheme = new Scheme({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description
    });
    scheme.save()
        .then(result => {
            console.log(result);
            res.redirect('/form.html')
            // res.status(201).json({
            //     message: "Created scheme successfully",
            //     createdScheme: {
            //         _id: result._id,
            //         description: result.description,
            //         request: {
            //             type: 'GET',
            //             url: 'http://localhost:3000/scheme/' + result._id
            //         }
            //     }
            // });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.schemes_get_single = (req, res, next) => {
    const id = req.params.id;
    Scheme.findById(id)
        .select('_id description')
        .exec()
        .then(scheme => {
            console.log(`From DB: ${scheme}`);
            if (scheme) {
                res.status(200).json({
                    scheme: scheme,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/scheme/'
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

exports.schemes_patch = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for (const key in req.body) {		//or const key of Object.keys(req.body)
        updateOps[key] = req.body[key];
    }

    Scheme.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Scheme updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/scheme/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.schemes_delete = (req, res, next) => {
    const id = req.params.id;
    Scheme.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Scheme deleted!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/scheme/',
                    body: {
                        description: "String"
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({ error: err });
        });
};