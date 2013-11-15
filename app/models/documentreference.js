var mongoose = require('mongoose');

var DocumentReferenceSchema = new mongoose.Schema({
    masterIdentifier: {
    },
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
    author: [{
        type: {
            value: String
        },
        reference: {
            value: String
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
    policyManager: {
        value: String
    },
    authenticator: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    created: {
        value: Date
    },
    indexed: {
        value: Date
    },
    status: {
        value: String
    },
    docStatus: {
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
    confidentiality: [{
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
    primaryLanguage: {
        value: String
    },
    mimeType: {
        value: String
    },
    format: {
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
    size: {
        value: Number
    },
    hash: {
        value: String
    },
    location: {
        value: String
    },
    service: {
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
        address: {
            value: String
        },
        parameter: [{
            name: {
                value: String
            },
            value: {
                value: String
            }
        }]
    },
    context: {
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
        facilityType: {
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
    }
});

mongoose.model('DocumentReference', DocumentReferenceSchema);
