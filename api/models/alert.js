const mongoose = require('mongoose');

const alertSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    machineID: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    probability: {
        type: String,
        required: true
    }
});

//model gives a constructor
module.exports = mongoose.model('Alert', alertSchema);