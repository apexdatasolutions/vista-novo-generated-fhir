var mongoose = require('mongoose');

var ImmunizationRecommendationSchema = new mongoose.Schema({
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    recommendation: [{
        recommendationDate: {
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
        doseNumber: {
            value: Number
        },
        forecastStatus: {
            value: String
        },
        dateCriterion: [{
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
            value: {
                value: Date
            }
        }],
        protocol: {
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
            }
        },
        supportingImmunization: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }],
        supportingAdverseEventReport: [{
            identifier: [{
            }],
            reportType: {
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
            reportDate: {
                value: Date
            },
            text: {
                value: String
            },
            reaction: [{
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            }]
        }],
        supportingPatientObservation: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }]
});

mongoose.model('ImmunizationRecommendation', ImmunizationRecommendationSchema);
