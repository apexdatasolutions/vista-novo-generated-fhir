var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: {
        value: String
    },
    description: {
        value: String
    },
    type: [{
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
    }],
    telecom: {
    },
    address: {
    },
    position: {
        longitude: {
            value: Number
        },
        latitude: {
            value: Number
        },
        altitude: {
            value: Number
        }
    },
    provider: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    active: {
        value: Boolean
    },
    partOf: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }
});

mongoose.model('Location', LocationSchema);
