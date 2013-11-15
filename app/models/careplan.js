var mongoose = require('mongoose');

var CarePlanSchema = new mongoose.Schema({
    identifier: [{
    }],
    patient: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    status: {
        value: String
    },
    period: {
    },
    modified: {
        value: Date
    },
    concern: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    participant: [{
        role: {
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
        member: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    goal: [{
        description: {
            value: String
        },
        status: {
            value: String
        },
        notes: {
            value: String
        },
        concern: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }],
    activity: [{
        goal: [{
        }],
        status: {
            value: String
        },
        prohibited: {
            value: Boolean
        },
        actionResulting: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }],
        notes: {
            value: String
        },
        detail: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        simple: {
            category: {
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
            timingSchedule: {
            },
            timingPeriod: {
            },
            timingString: {
                value: String
            },
            location: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            performer: [{
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            }],
            product: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            dailyAmount: {
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
            details: {
                value: String
            }
        }
    }],
    notes: {
        value: String
    }
});

mongoose.model('CarePlan', CarePlanSchema);
