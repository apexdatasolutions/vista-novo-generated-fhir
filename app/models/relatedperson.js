var mongoose = require('mongoose');

var RelatedPersonSchema = new mongoose.Schema({
    identifier: [{
    }],
    patient: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    relationship: {
        coding: [{
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        }]
    },
    name: {
    },
    telecom: [{
    }],
    gender: {
        coding: [{
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        }]
    },
    address: {
    },
    photo: [{
    }]
});

mongoose.model('RelatedPerson', RelatedPersonSchema);
