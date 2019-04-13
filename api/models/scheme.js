const mongoose = require('mongoose');

const schemeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        required: true
    }
});

//model gives a constructor
module.exports = mongoose.model('Scheme', schemeSchema);