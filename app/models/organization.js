var mongoose = require('mongoose');

var OrganizationSchema = new mongoose.Schema({
    identifier: [{
    }],
    name: String,
    fhirType: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    telecom: [{
    }],
    address: [{
    }],
    partOf: {
        reference: String,
        display: String
    },
    contact: [{
        purpose: {
            coding: [{
                system: String,
                code: String,
                display: String
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
                system: String,
                code: String,
                display: String
            }]
        }
    }],
    active: Boolean,
});

mongoose.model('Organization', OrganizationSchema);
