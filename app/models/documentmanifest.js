var mongoose = require('mongoose');

var DocumentManifestSchema = new mongoose.Schema({
    identifier: {
    },
    subject: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    recipient: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
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
    author: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    created: {
        value: Date
    },
    source: {
        value: String
    },
    status: {
        value: String
    },
    supercedes: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    description: {
        value: String
    },
    confidentiality: {
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
    content: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('DocumentManifest', DocumentManifestSchema);
