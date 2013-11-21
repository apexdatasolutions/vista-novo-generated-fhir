var mongoose = require('mongoose');

var DeviceObservationSchema = new mongoose.Schema({
    code: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    identifier: [{
    }],
    issued: Date,
    subject: {
        reference: String,
        display: String
    },
    device: {
        reference: String,
        display: String
    },
    measurement: [{
        reference: String,
        display: String
    }]
});

mongoose.model('DeviceObservation', DeviceObservationSchema);
