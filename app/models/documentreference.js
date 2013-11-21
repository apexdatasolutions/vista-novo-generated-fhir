var mongoose = require('mongoose');

var DocumentReferenceSchema = new mongoose.Schema({
    masterIdentifier: {
    },
    identifier: [{
    }],
    subject: {
        reference: String,
        display: String
    },
    fhirType: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    subtype: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    author: [{
        reference: String,
        display: String
    }],
    custodian: {
        reference: String,
        display: String
    },
    policyManager: String,
    authenticator: {
        reference: String,
        display: String
    },
    created: Date,
    indexed: Date,
    status: String,
    docStatus: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    supercedes: {
        reference: String,
        display: String
    },
    description: String,
    confidentiality: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    primaryLanguage: String,
    mimeType: String,
    format: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    size: Number,
    hash: String,
    location: String,
    service: {
        fhirType: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        address: String,
        parameter: [{
            name: String,
            value: String,
        }]
    },
    context: {
        code: [{
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }],
        period: {
        },
        facilityType: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }
    }
});

mongoose.model('DocumentReference', DocumentReferenceSchema);
