var mongoose = require('mongoose');

var DeviceLogSchema = new mongoose.Schema({
    instant: {
        value: Date
    },
    capabilities: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    item: [{
        key: {
            value: String
        },
        value: {
            value: String
        },
        flag: [{
            value: String
        }]
    }]
});

mongoose.model('DeviceLog', DeviceLogSchema);
