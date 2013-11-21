var mongoose = require('mongoose');

var RelatedPersonSchema = new mongoose.Schema({
    identifier: [{
    }],
    patient: {
        reference: String,
        display: String
    },
    relationship: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    name: {
    },
    telecom: [{
    }],
    gender: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    address: {
    },
    photo: [{
    }]
});

mongoose.model('RelatedPerson', RelatedPersonSchema);
