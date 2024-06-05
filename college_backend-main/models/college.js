const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    nirfRanking: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    package: {
        type: String,
        required: true
    }
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;