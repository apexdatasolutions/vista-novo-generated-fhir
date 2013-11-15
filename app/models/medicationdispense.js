var mongoose = require('mongoose');

var MedicationDispenseSchema = new mongoose.Schema({
    identifier: {
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
    dispenser: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    authorizingPrescription: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    dispense: [{
        identifier: {
        },
        status: {
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
        medication: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        whenPrepared: {
        },
        whenHandedOver: {
        },
        destination: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        receiver: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }],
        dosage: [{
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
            rate: {
            },
            maxDosePerPeriod: {
            }
        }]
    }],
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
        responsibleParty: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }
});

mongoose.model('MedicationDispense', MedicationDispenseSchema);
