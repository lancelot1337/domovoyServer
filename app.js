const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/user');
const schemeRoutes = require('./api/routes/scheme');
const Scheme = require('./api/models/scheme');
const Alert = require('./api/models/alert');
const subscribeRoutes = require('./api/routes/subscribe');
const Subscribe = require('./api/models/subscribe');
const AlertRoutes = require('./api/routes/alert');

// //for mongoose
// const uri = `mongodb://rest-shop-api:${process.env.MONGODB_PWD}@ds257981.mlab.com:57981/rest-shop-api`;
// mongoose.connect(uri, { useNewUrlParser: true })
//     .then((result => {
//         console.log(`DB connected!`);
//     }))
//     .catch(err => {
//         console.log(`DB failed to connect, error: ${err}`);
//     });

mongoose.connect('mongodb://localhost/domovoy').then(() => {
    console.log('db connect');
}, (e) => {
    console.log('error:' + e)
});

mongoose.Promise = global.Promise;

//for logging
app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// //making uploads statically available
// app.use('/uploads', express.static('uploads'));

//for bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//to handle cross-origin resource sharing (CORS) errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //browser send an OPTIONS request when we send post or put request
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

var rating = [];

//routes
app.use('/admin', adminRoutes);
app.use('/user', (req, res, next) => {
    Alert.find()
    .exec()
    .then(alerts => {
        const response = {
            count: alerts.length,
            alertS: alerts.map(alert => {
                return {
                    _id: alert._id,
                    machineID: alert.machineID,
                    result: alert.result,
                    probability: alert.probability
                }
            })
        }
        res.render(`user_index`, {response: response})
    })
});

app.use('/scheme', schemeRoutes);
app.use('/subscribe', subscribeRoutes);
app.use('/alert', AlertRoutes);
app.use('/tab-panel', (req, res, next) => {
    Scheme.find()
        .select('_id description')
        .exec()
        .then(schemes => {
            let ctr = 1;
            const response = {
                count: schemes.length,
                schemes: schemes.map(scheme => {
                    return {
                        _id: scheme._id,
                        vid: `Scheme ${ctr++}`,
                        description: scheme.description
                    }
                })
            }
            Subscribe.find()
                .select('uid sid')
                .exec()
                .then(subscribes => {
                    const sub = {
                        data: subscribes.map(ssub => {
                            return {
                                uid: ssub.uid,
                                sid: ssub.sid
                            }
                        })
                    }

                    Subscribe.distinct('uid').exec((err, count) => {
                        const usercount = count.length;
                        const schemeCount = response.schemes.length;
                        const subINFO = {
                            usercount: usercount,
                            schemeCount: schemeCount
                        }


                        // for (let index = 0; index < usercount; index++) {
                        //     let temp = [];
                        //     for (let j = 0; j < schemeCount; j++) {
                        //         temp.push(0);
                        //     }
                        //     rating.push(temp);
                        // }
                        // for (let i = 0; i < schemeCount; i++) {
                        //     const element = response.schemes[i]._id;
                        //     // console.log(`THIS: ${element}`)
                        //     for (let j = 0; j < usercount; j++) {
                        //         Subscribe.find()
                        //             .select(`uid sid`)
                        //             .then(users => {
                        //                 users.map(user => {
                        //                     if (user.uid == j + 1) {
                        //                         console.log(user.sid)

                        //                         if (user.sid == element) {
                        //                             ++rating[j][i]
                        //                             console.log(rating[j][i])
                        //                         }
                        //                     }
                        //                 })
                        //             })
                        //             .catch(err => {
                        //                 res.status(500).json({ error: err })
                        //             })

                        //     }

                        // }


                        console.log(rating);
                        res.render('tab-panel', { response: response, sub: sub, subINFO: subINFO });
                    });

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

})
app.use('/', (req, res, next) => {
    res.redirect('/admin');
});



//for error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;