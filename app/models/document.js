var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    identifier: {
    },
    versionIdentifier: {
    },
    created: Date,
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
    title: String,
    status: String,
    confidentiality: {
        system: String,
        code: String,
        display: String
    },
    subject: {
        reference: String,
        display: String
    },
    author: [{
        reference: String,
        display: String
    }],
    attester: [{
        mode: String,
        time: Date,
        party: {
            reference: String,
            display: String
        }
    }],
    custodian: {
        reference: String,
        display: String
    },
    event: {
        code: [{
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }],
        period: {
        },
        detail: [{
            reference: String,
            display: String
        }]
    },
    encounter: {
        reference: String,
        display: String
    },
    replaces: {
    },
    provenance: [{
        reference: String,
        display: String
    }],
    stylesheet: {
    },
    representation: {
    },
    section: [{
        code: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        subject: {
            reference: String,
            display: String
        },
        content: {
            reference: String,
            display: String
        },
        section: [{
        }]
    }]
});

mongoose.model('Document', DocumentSchema);
