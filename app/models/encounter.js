var mongoose = require('mongoose');

var EncounterSchema = new mongoose.Schema({
    identifier: [{
    }],
    status: {
        value: String
    },
    class: {
        value: String
    },
    type: [{
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
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    participant: [{
        type: [{
            value: String
        }],
        practitioner: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    fulfills: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    start: {
        value: Date
    },
    length: {
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
    indication: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    priority: {
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
    hospitalization: {
        preAdmissionIdentifier: {
        },
        origin: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        admitSource: {
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
        period: {
        },
        accomodation: [{
            bed: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            period: {
            }
        }],
        diet: {
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
        specialCourtesy: [{
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
        specialArrangement: [{
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
        destination: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        dischargeDisposition: {
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
        reAdmission: {
            value: Boolean
        }
    },
    location: [{
        location: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        period: {
        }
    }],
    serviceProvider: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    partOf: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }
});

mongoose.model('Encounter', EncounterSchema);
