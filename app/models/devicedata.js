var mongoose = require('mongoose');

var DeviceDataSchema = new mongoose.Schema({
    instant: {
        value: Date
    },
    identifier: {
    },
    source: {
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
    virtualDevice: [{
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
        channel: [{
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
            metric: [{
                observation: {
                    type: {
                        value: String
                    },
                    reference: {
                        value: String
                    }
                }
            }]
        }]
    }]
});

mongoose.model('DeviceData', DeviceDataSchema);
