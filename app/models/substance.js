var mongoose = require('mongoose');

var SubstanceSchema = new mongoose.Schema({
    identifier: {
    },
    name: String,
    fhirType: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    description: String,
    status: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    effectiveTime: {
    },
    quantity: {
        value: String,
        units: String,
        system: String,
        code: String
    },
    ingredient: [{
        reference: String,
        display: String
    }],
    quantityMode: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }
});

mongoose.model('Substance', SubstanceSchema);
