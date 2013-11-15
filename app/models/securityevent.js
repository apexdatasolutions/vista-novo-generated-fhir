var mongoose = require('mongoose');

var SecurityEventSchema = new mongoose.Schema({
    event: {
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
        subtype: [{
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
        action: {
            value: String
        },
        dateTime: {
            value: Date
        },
        outcome: {
            value: String
        },
        outcomeDesc: {
            value: String
        }
    },
    participant: [{
        role: [{
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
        reference: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        userId: {
            value: String
        },
        authId: {
            value: String
        },
        name: {
            value: String
        },
        requestor: {
            value: Boolean
        },
        media: {
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
        network: {
            identifier: {
                value: String
            },
            type: {
                value: String
            }
        }
    }],
    source: {
        site: {
            value: String
        },
        identifier: {
            value: String
        },
        type: [{
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
    object: [{
        identifier: {
        },
        reference: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        type: {
            value: String
        },
        role: {
            value: String
        },
        lifecycle: {
            value: String
        },
        sensitivity: {
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
        name: {
            value: String
        },
        query: {
        },
        detail: [{
            type: {
                value: String
            },
            value: {
            }
        }]
    }]
});

mongoose.model('SecurityEvent', SecurityEventSchema);
