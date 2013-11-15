var mongoose = require('mongoose');

var ImmunizationSchema = new mongoose.Schema({
    date: {
        value: Date
    },
    vaccineType: {
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
    refusedIndicator: {
        value: Boolean
    },
    reported: {
        value: Boolean
    },
    performer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    requester: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    manufacturer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    location: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    lotNumber: {
        value: String
    },
    expirationDate: {
        value: Date
    },
    site: {
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
    route: {
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
    doseQuantity: {
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
    explanation: {
        reason: [{
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
        refusalReason: [{
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
        }]
    },
    reaction: [{
        date: {
            value: Date
        },
        detail: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        reported: {
            value: Boolean
        }
    }],
    vaccinationProtocol: {
        doseSequence: {
            value: Number
        },
        description: {
            value: String
        },
        authority: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        series: {
            value: String
        },
        seriesDoses: {
            value: Number
        },
        doseTarget: {
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
        doseStatus: {
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
        doseStatusReason: {
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

mongoose.model('Immunization', ImmunizationSchema);
