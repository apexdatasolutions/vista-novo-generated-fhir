var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    identifier: {
    },
    fhirType: String,
    actual: Boolean,
    code: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    name: String,
    quantity: Number,
    characteristic: [{
        fhirType: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        valueCodeableConcept: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        valueString: String,
        valueBoolean: Boolean,
        valueQuantity: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        valueRange: {
        },
        exclude: Boolean,
    }],
    member: [{
        reference: String,
        display: String
    }]
});

mongoose.model('Group', GroupSchema);
