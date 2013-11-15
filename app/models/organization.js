var mongoose = require('mongoose');

var OrganizationSchema = new mongoose.Schema({
    identifier: [{
    }],
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
    telecom: [{
    }],
    address: [{
    }],
    partOf: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    contact: [{
        purpose: {
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
        name: {
        },
        telecom: [{
        }],
        address: {
        },
        gender: {
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
    }],
    active: {
        value: Boolean
    }
});

mongoose.model('Organization', OrganizationSchema);
