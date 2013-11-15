var mongoose = require('mongoose');

var QuestionnaireSchema = new mongoose.Schema({
    status: {
        value: String
    },
    authored: {
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
    author: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    source: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
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
    identifier: [{
    }],
    encounter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    question: [{
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
        text: {
            value: String
        },
        answerDecimal: {
            value: Number
        },
        answerInteger: {
            value: Number
        },
        answerBoolean: {
            value: Boolean
        },
        answerDate: {
            value: Date
        },
        answerString: {
            value: String
        },
        answerDateTime: {
            value: Date
        },
        answerInstant: {
            value: Date
        },
        choice: [{
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        }],
        optionsUri: {
            value: String
        },
        optionsResource: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        data: {
        },
        remarks: {
            value: String
        }
    }],
    group: [{
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
        header: {
            value: String
        },
        text: {
            value: String
        },
        subject: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        question: [{
        }],
        group: [{
        }]
    }]
});

mongoose.model('Questionnaire', QuestionnaireSchema);
