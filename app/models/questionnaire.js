var mongoose = require('mongoose');

var QuestionnaireSchema = new mongoose.Schema({
    status: String,
    authored: Date,
    subject: {
        reference: String,
        display: String
    },
    author: {
        reference: String,
        display: String
    },
    source: {
        reference: String,
        display: String
    },
    name: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    identifier: [{
    }],
    encounter: {
        reference: String,
        display: String
    },
    question: [{
        name: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        text: String,
        answerDecimal: Number,
        answerInteger: Number,
        answerBoolean: Boolean,
        answerDate: Date,
        answerString: String,
        answerDateTime: Date,
        answerInstant: Date,
        choice: [{
            system: String,
            code: String,
            display: String
        }],
        optionsUri: String,
        optionsResource: {
            reference: String,
            display: String
        },
        data: {
        },
        remarks: String,
    }],
    group: [{
        name: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        header: String,
        text: String,
        subject: {
            reference: String,
            display: String
        },
        question: [{
        }],
        group: [{
        }]
    }]
});

mongoose.model('Questionnaire', QuestionnaireSchema);
