var mongoose = require('mongoose');

var OtherSchema = new mongoose.Schema({
    code: {
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
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    author: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    created: {
        value: Date
    }
});

mongoose.model('Other', OtherSchema);
