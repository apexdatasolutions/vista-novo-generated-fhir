var mongoose = require('mongoose');

var SpecimenSchema = new mongoose.Schema({
    identifier: {
    },
    fhirType: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    source: [{
        relationship: String,
        target: [{
            reference: String,
            display: String
        }]
    }],
    subject: {
        reference: String,
        display: String
    },
    accessionIdentifier: [{
    }],
    receivedTime: Date,
    collection: {
        collector: {
            reference: String,
            display: String
        },
        comment: String,
        collectedTime: Date,
        quantity: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        method: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        sourceSite: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }
    },
    treatment: [{
        description: String,
        procedure: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        additive: [{
            reference: String,
            display: String
        }]
    }],
    container: [{
        identifier: [{
        }],
        description: String,
        fhirType: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        capacity: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        specimenQuantity: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        additive: {
            reference: String,
            display: String
        }
    }]
});

mongoose.model('Specimen', SpecimenSchema);
