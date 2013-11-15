var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
    identifier: {
    },
    versionIdentifier: {
    },
    created: {
        value: Date
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
    subtype: {
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
    title: {
        value: String
    },
    status: {
        value: String
    },
    confidentiality: {
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
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    author: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    attester: [{
        mode: {
            value: String
        },
        time: {
            value: Date
        },
        party: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    custodian: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    event: {
        code: [{
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
        period: {
        },
        detail: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    },
    encounter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    replaces: {
    },
    provenance: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    stylesheet: {
    },
    representation: {
    },
    section: [{
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
        subject: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        content: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        section: [{
        }]
    }]
});

mongoose.model('Document', DocumentSchema);
