var mongoose = require('mongoose');

var OperationOutcomeSchema = new mongoose.Schema({
    issue: [{
        severity: {
            value: String
        },
        type: {
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
        details: {
            value: String
        },
        location: [{
            value: String
        }]
    }]
});

mongoose.model('OperationOutcome', OperationOutcomeSchema);
