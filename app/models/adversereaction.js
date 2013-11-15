var mongoose = require('mongoose');

var AdverseReactionSchema = new mongoose.Schema({
    identifier: [{
    }],
    reactionDate: {
        value: Date
    },
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    didNotOccurFlag: {
        value: Boolean
    },
    recorder: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    symptom: [{
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
        severity: {
            value: String
        }
    }],
    exposure: [{
        exposureDate: {
            value: Date
        },
        exposureType: {
            value: String
        },
        causalityExpectation: {
            value: String
        },
        substance: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }]
});

mongoose.model('AdverseReaction', AdverseReactionSchema);
