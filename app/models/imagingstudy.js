var mongoose = require('mongoose');

var ImagingStudySchema = new mongoose.Schema({
    dateTime: {
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
    uid: {
    },
    accessionNo: {
    },
    identifier: [{
    }],
    order: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    modality: [{
        value: String
    }],
    referrer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    availability: {
        value: String
    },
    url: {
        value: String
    },
    numberOfSeries: {
        value: Number
    },
    numberOfInstances: {
        value: Number
    },
    clinicalInformation: {
        value: String
    },
    procedure: [{
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
    interpreter: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    description: {
        value: String
    },
    series: [{
        number: {
            value: Number
        },
        modality: {
            value: String
        },
        uid: {
        },
        description: {
            value: String
        },
        numberOfInstances: {
            value: Number
        },
        availability: {
            value: String
        },
        url: {
            value: String
        },
        bodySite: {
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            }
        },
        dateTime: {
            value: Date
        },
        instance: [{
            number: {
                value: Number
            },
            uid: {
            },
            sopclass: {
            },
            type: {
                value: String
            },
            title: {
                value: String
            },
            url: {
                value: String
            },
            attachment: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            }
        }]
    }]
});

mongoose.model('ImagingStudy', ImagingStudySchema);
