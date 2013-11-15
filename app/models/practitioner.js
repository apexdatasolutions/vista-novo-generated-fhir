var mongoose = require('mongoose');

var PractitionerSchema = new mongoose.Schema({
    identifier: [{
    }],
    name: {
    },
    telecom: [{
    }],
    address: {
    },
    gender: {
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
    birthDate: {
        value: Date
    },
    photo: [{
    }],
    organization: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    role: [{
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
    specialty: [{
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
    period: {
    },
    qualification: [{
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
        period: {
        },
        issuer: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    communication: [{
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
});

mongoose.model('Practitioner', PractitionerSchema);
