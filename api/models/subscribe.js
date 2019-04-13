const mongoose = require('mongoose');

const subscribeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uid: {
        type: String,
        required: true
    },
    sid:{
        type: String,
        required: true
    }
});

//model gives a constructor
module.exports = mongoose.model('Subscribe', subscribeSchema);