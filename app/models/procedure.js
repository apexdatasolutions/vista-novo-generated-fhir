var mongoose = require('mongoose');

var ProcedureSchema = new mongoose.Schema({
    identifier: [{
    }],
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
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
    bodySite: [{
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
    }],
    indication: [{
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
    }],
    performer: [{
        person: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        role: {
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
        }
    }],
    date: {
    },
    encounter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    outcome: {
        value: String
    },
    report: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    complication: [{
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
    }],
    followUp: {
        value: String
    },
    relatedItem: [{
        type: {
            value: String
        },
        target: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    notes: {
        value: String
    }
});

mongoose.model('Procedure', ProcedureSchema);
