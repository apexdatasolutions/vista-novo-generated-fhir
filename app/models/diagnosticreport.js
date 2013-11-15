var mongoose = require('mongoose');

var DiagnosticReportSchema = new mongoose.Schema({
    status: {
        value: String
    },
    issued: {
        value: Date
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
    reportId: {
    },
    requestDetail: [{
        encounter: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        requestOrderId: {
        },
        receiverOrderId: {
        },
        requestTest: [{
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
        requester: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        clinicalInfo: {
            value: String
        }
    }],
    serviceCategory: {
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
    diagnosticDateTime: {
        value: Date
    },
    diagnosticPeriod: {
    },
    results: {
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
        specimen: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        group: [{
        }],
        result: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    },
    image: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    conclusion: {
        value: String
    },
    codedDiagnosis: [{
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
    representation: [{
    }]
});

mongoose.model('DiagnosticReport', DiagnosticReportSchema);
