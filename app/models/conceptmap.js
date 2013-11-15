var mongoose = require('mongoose');

var ConceptMapSchema = new mongoose.Schema({
    identifier: {
        value: String
    },
    version: {
        value: String
    },
    name: {
        value: String
    },
    publisher: {
        value: String
    },
    telecom: [{
    }],
    description: {
        value: String
    },
    copyright: {
        value: String
    },
    status: {
        value: String
    },
    experimental: {
        value: Boolean
    },
    date: {
        value: Date
    },
    source: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    target: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    concept: [{
        name: {
            value: String
        },
        system: {
            value: String
        },
        code: {
            value: String
        },
        map: [{
            system: {
                value: String
            },
            code: {
                value: String
            },
            equivalence: {
                value: String
            },
            comments: {
                value: String
            }
        }],
        concept: [{
        }]
    }]
});

mongoose.model('ConceptMap', ConceptMapSchema);
