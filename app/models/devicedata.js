var mongoose = require('mongoose');

var DeviceDataSchema = new mongoose.Schema({
    instant: Date,
    identifier: {
    },
    source: {
        reference: String,
        display: String
    },
    subject: {
        reference: String,
        display: String
    },
    virtualDevice: [{
        code: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        channel: [{
            code: {
                coding: [{
                    system: String,
                    code: String,
                    display: String
                }]
            },
            metric: [{
                observation: {
                    reference: String,
                    display: String
                }
            }]
        }]
    }]
});

mongoose.model('DeviceData', DeviceDataSchema);
