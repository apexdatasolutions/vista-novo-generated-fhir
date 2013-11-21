var mongoose = require('mongoose');

var DeviceLogSchema = new mongoose.Schema({
    instant: Date,
    capabilities: {
        reference: String,
        display: String
    },
    subject: {
        reference: String,
        display: String
    },
    item: [{
        key: String,
        value: String,
        flag: String,
    }]
});

mongoose.model('DeviceLog', DeviceLogSchema);
