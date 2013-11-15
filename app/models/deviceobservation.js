var mongoose = require('mongoose');

var DeviceObservationSchema = new mongoose.Schema({
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
    identifier: [{
    }],
    issued: {
        value: Date
    },
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    device: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    measurement: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('DeviceObservation', DeviceObservationSchema);
