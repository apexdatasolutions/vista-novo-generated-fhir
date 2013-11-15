var mongoose = require('mongoose');

var ProvenanceSchema = new mongoose.Schema({
    target: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    period: {
    },
    recorded: {
        value: Date
    },
    reason: {
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
    location: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    policy: [{
        value: String
    }],
    agent: [{
        role: {
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        },
        type: {
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        },
        reference: {
            value: String
        },
        display: {
            value: String
        }
    }],
    entity: [{
        role: {
            value: String
        },
        type: {
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        },
        reference: {
            value: String
        },
        display: {
            value: String
        },
        agent: {
        }
    }],
    signature: {
        value: String
    }
});

mongoose.model('Provenance', ProvenanceSchema);
