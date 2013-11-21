var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: String,
    description: String,
    fhirType: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    telecom: {
    },
    address: {
    },
    position: {
        longitude: Number,
        latitude: Number,
        altitude: Number,
    },
    provider: {
        reference: String,
        display: String
    },
    active: Boolean,
    partOf: {
        reference: String,
        display: String
    }
});

mongoose.model('Location', LocationSchema);
