var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema({
    identifier: [{
    }],
    name: [{
    }],
    telecom: [{
    }],
    gender: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    birthDate: Date,
    deceasedBoolean: Boolean,
    deceasedDateTime: Date,
    address: [{
    }],
    maritalStatus: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    multipleBirthBoolean: Boolean,
    multipleBirthInteger: Number,
    photo: [{
    }],
    contact: [{
        relationship: [{
            coding: [{
                system: String,
                code: String,
                display: String
            }]
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
        organization: {
            reference: String,
            display: String
        }
    }],
    animal: {
        species: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        breed: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        genderStatus: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        }
    },
    communication: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    provider: {
        reference: String,
        display: String
    },
    link: [{
        reference: String,
        display: String
    }],
    active: Boolean,
});

mongoose.model('Patient', PatientSchema);
