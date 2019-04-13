const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// //for mongoose
// const uri = `mongodb://rest-shop-api:${process.env.MONGODB_PWD}@ds257981.mlab.com:57981/rest-shop-api`;
// mongoose.connect(uri, { useNewUrlParser: true })
//     .then((result => {
//         console.log(`DB connected!`);
//     }))
//     .catch(err => {
//         console.log(`DB failed to connect, error: ${err}`);
//     });

// // mongoose.connect('mongodb://localhost/node-rest-shop').then(()=>{
// // 	console.log('db connect');
// // },(e)=>{
// // 	console.log('error:'+ e)
// // });

// mongoose.Promise = global.Promise;

//for logging
app.use(morgan('dev'));

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

// //routes to productRoutes
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
// app.use('/user', userRoutes);
app.use('/', (req, res, next) => {
    res.json({
        message: "OK"
    });
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