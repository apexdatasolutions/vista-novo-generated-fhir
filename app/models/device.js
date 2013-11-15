var mongoose = require('mongoose');

var DeviceSchema = new mongoose.Schema({
    identifier: [{
    }],
    type: {
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
    manufacturer: {
        value: String
    },
    model: {
        value: String
    },
    version: {
        value: String
    },
    expiry: {
        value: Date
    },
    udi: {
        value: String
    },
    lotNumber: {
        value: String
    },
    owner: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    location: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    patient: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    contact: [{
    }],
    url: {
        value: String
    }
});

mongoose.model('Device', DeviceSchema);
