var mongoose = require('mongoose');

var MediaSchema = new mongoose.Schema({
    type: {
        value: String
    },
    subtype: {
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
    dateTime: {
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
    operator: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    view: {
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
    deviceName: {
        value: String
    },
    height: {
        value: Number
    },
    width: {
        value: Number
    },
    frames: {
        value: Number
    },
    length: {
        value: Number
    },
    content: {
    }
});

mongoose.model('Media', MediaSchema);
