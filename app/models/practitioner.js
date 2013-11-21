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
            system: String,
            code: String,
            display: String
        }]
    },
    birthDate: Date,
    photo: [{
    }],
    organization: {
        reference: String,
        display: String
    },
    role: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    specialty: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    period: {
    },
    qualification: [{
        code: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        period: {
        },
        issuer: {
            reference: String,
            display: String
        }
    }],
    communication: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }]
});

mongoose.model('Practitioner', PractitionerSchema);
