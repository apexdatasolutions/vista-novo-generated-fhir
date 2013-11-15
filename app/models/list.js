var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
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
    date: {
        value: Date
    },
    ordered: {
        value: Boolean
    },
    mode: {
        value: String
    },
    entry: [{
        flag: [{
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
        deleted: {
            value: Boolean
        },
        date: {
            value: Date
        },
        item: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    emptyReason: {
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
    }
});

mongoose.model('List', ListSchema);
