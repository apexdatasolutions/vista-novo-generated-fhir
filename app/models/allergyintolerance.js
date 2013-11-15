var mongoose = require('mongoose');

var AllergyIntoleranceSchema = new mongoose.Schema({
    identifier: [{
    }],
    criticality: {
        value: String
    },
    sensitivityType: {
        value: String
    },
    recordedDate: {
        value: Date
    },
    status: {
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
    recorder: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    substance: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    reaction: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    sensitivityTest: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('AllergyIntolerance', AllergyIntoleranceSchema);
