var mongoose = require('mongoose');

var MediaSchema = new mongoose.Schema({
    fhirType: String,
    subtype: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    identifier: [{
    }],
    dateTime: Date,
    subject: {
        reference: String,
        display: String
    },
    operator: {
        reference: String,
        display: String
    },
    view: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    deviceName: String,
    height: Number,
    width: Number,
    frames: Number,
    length: Number,
    content: {
    }
});

mongoose.model('Media', MediaSchema);
