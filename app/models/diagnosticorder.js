var mongoose = require('mongoose');

var DiagnosticOrderSchema = new mongoose.Schema({
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    orderer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    identifier: [{
    }],
    encounter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    clinicalNotes: {
        value: String
    },
    specimen: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    status: {
        value: String
    },
    priority: {
        value: String
    },
    event: [{
        status: {
            value: String
        },
        date: {
            value: Date
        },
        actor: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    item: [{
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
        specimen: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }],
        bodySite: {
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
        status: {
            value: String
        },
        event: [{
        }]
    }]
});

mongoose.model('DiagnosticOrder', DiagnosticOrderSchema);
