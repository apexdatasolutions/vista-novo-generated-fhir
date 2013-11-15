var mongoose = require('mongoose');

var SpecimenSchema = new mongoose.Schema({
    identifier: {
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
    source: [{
        relationship: {
            value: String
        },
        target: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }],
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    accessionIdentifier: [{
    }],
    receivedTime: {
        value: Date
    },
    collection: {
        collector: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        comment: [{
            value: String
        }],
        collectedTime: {
            value: Date
        },
        quantity: {
            value: {
                value: String
            },
            units: {
                value: String
            },
            system: {
                value: String
            },
            code: {
                value: String
            }
        },
        method: {
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
        sourceSite: {
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
    },
    treatment: [{
        description: {
            value: String
        },
        procedure: {
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
        additive: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }],
    container: [{
        identifier: [{
        }],
        description: {
            value: String
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
        capacity: {
            value: {
                value: String
            },
            units: {
                value: String
            },
            system: {
                value: String
            },
            code: {
                value: String
            }
        },
        specimenQuantity: {
            value: {
                value: String
            },
            units: {
                value: String
            },
            system: {
                value: String
            },
            code: {
                value: String
            }
        },
        additive: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }]
});

mongoose.model('Specimen', SpecimenSchema);
