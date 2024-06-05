const mongoose = require('mongoose');

const opinionSchema = new mongoose.Schema({
    opinion: {
        type: [String],
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
});

const Opinion = mongoose.model('Opinion', opinionSchema);

exports.Opinion = Opinion;