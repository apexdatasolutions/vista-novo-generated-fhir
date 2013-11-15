var mongoose = require('mongoose');

var AlertSchema = new mongoose.Schema({
    category: {
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
    status: {
        value: String
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
    note: {
        value: String
    }
});

mongoose.model('Alert', AlertSchema);
