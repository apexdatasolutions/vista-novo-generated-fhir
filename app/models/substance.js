var mongoose = require('mongoose');

var SubstanceSchema = new mongoose.Schema({
    identifier: {
    },
    name: {
        value: String
    },
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
    description: {
        value: String
    },
    status: {
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
    effectiveTime: {
    },
    quantity: {
        value: {
            value: String
        },
        units: {
            value: String
        },
        system: {
            value: String
        },
        code: {
            value: String
        }
    },
    ingredient: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    quantityMode: {
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

mongoose.model('Substance', SubstanceSchema);
