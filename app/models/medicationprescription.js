var mongoose = require('mongoose');

var MedicationPrescriptionSchema = new mongoose.Schema({
    identifier: [{
    }],
    dateWritten: {
        value: Date
    },
    status: {
        value: String
    },
    patient: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    prescriber: {
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
    reasonForPrescribing: {
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
    medication: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    dosageInstruction: [{
        dosageInstructionsText: {
            value: String
        },
        additionalInstructions: {
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
        timingDateTime: {
            value: Date
        },
        timingPeriod: {
        },
        timingSchedule: {
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
        rate: {
        },
        maxDosePerPeriod: {
        }
    }],
    dispense: {
        medication: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        validityPeriod: {
        },
        numberOfRepeatsAllowed: {
            value: Number
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
        expectedSupplyDuration: {
        }
    },
    substitution: {
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
        }
    }
});

mongoose.model('MedicationPrescription', MedicationPrescriptionSchema);
