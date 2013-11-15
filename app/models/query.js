var mongoose = require('mongoose');

var QuerySchema = new mongoose.Schema({
    identifier: {
        value: String
    },
    parameter: [{
    }],
    response: {
        identifier: {
            value: String
        },
        outcome: {
            value: String
        },
        total: {
            value: Number
        },
        parameter: [{
        }],
        first: [{
        }],
        previous: [{
        }],
        next: [{
        }],
        last: [{
        }],
        reference: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }
});

mongoose.model('Query', QuerySchema);
