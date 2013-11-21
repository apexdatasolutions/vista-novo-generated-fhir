var mongoose = require('mongoose');

var FamilyHistorySchema = new mongoose.Schema({
    identifier: [{
    }],
    subject: {
        reference: String,
        display: String
    },
    note: String,
    relation: [{
        name: String,
        relationship: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        deceasedBoolean: Boolean,
        deceasedAge: {
            value: String,
            units: String,
            system: String,
            code: String
        },
        deceasedRange: {
        },
        deceasedString: String,
        note: String,
        condition: [{
            fhirType: {
                coding: [{
                    system: String,
                    code: String,
                    display: String
                }]
            },
            outcome: {
                coding: [{
                    system: String,
                    code: String,
                    display: String
                }]
            },
            onsetAge: {
                value: String,
                units: String,
                system: String,
                code: String
            },
            onsetRange: {
            },
            onsetString: String,
            note: String,
        }]
    }]
});

mongoose.model('FamilyHistory', FamilyHistorySchema);
