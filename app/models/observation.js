var mongoose = require('mongoose');

var ObservationSchema = new mongoose.Schema({
    name: {
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
    valueQuantity: {
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
    valueCodeableConcept: {
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
    valueAttachment: {
    },
    valueRatio: {
    },
    valuePeriod: {
    },
    valueSampledData: {
    },
    valueString: {
        value: String
    },
    interpretation: {
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
    comments: {
        value: String
    },
    appliesPeriod: {
    },
    appliesDateTime: {
        value: Date
    },
    issued: {
        value: Date
    },
    status: {
        value: String
    },
    reliability: {
        value: String
    },
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
    identifier: {
    },
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    performer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    referenceRange: [{
        meaning: {
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
        rangeQuantity: {
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
        rangeRange: {
        },
        rangeString: {
            value: String
        }
    }],
    component: [{
        name: {
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
        valueQuantity: {
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
        valueCodeableConcept: {
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
        valueAttachment: {
        },
        valueRatio: {
        },
        valuePeriod: {
        },
        valueSampledData: {
        },
        valueString: {
            value: String
        }
    }]
});

mongoose.model('Observation', ObservationSchema);
