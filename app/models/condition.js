var mongoose = require('mongoose');

var ConditionSchema = new mongoose.Schema({
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
    encounter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    asserter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    dateAsserted: {
        value: Date
    },
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
    category: {
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
    certainty: {
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
    onsetDate: {
        value: Date
    },
    onsetAge: {
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
    abatementDate: {
        value: Date
    },
    abatementAge: {
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
    abatementBoolean: {
        value: Boolean
    },
    stage: {
        summary: {
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
        assessment: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    },
    evidence: [{
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
        detail: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }],
    location: [{
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
        detail: {
            value: String
        }
    }],
    relatedItem: [{
        type: {
            value: String
        },
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

mongoose.model('Condition', ConditionSchema);
