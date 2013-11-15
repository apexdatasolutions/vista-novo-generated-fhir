var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
    date: {
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
    source: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    target: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    reason: {
        value: String
    },
    authority: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    when: {
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
        schedule: {
        }
    },
    detail: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('Order', OrderSchema);
