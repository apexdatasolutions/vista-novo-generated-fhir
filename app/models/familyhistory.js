var mongoose = require('mongoose');

var FamilyHistorySchema = new mongoose.Schema({
    identifier: [{
    }],
    subject: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    note: {
        value: String
    },
    relation: [{
        name: {
            value: String
        },
        relationship: {
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
        deceasedBoolean: {
            value: Boolean
        },
        deceasedAge: {
            value: {
                value: String
            },
            units: {
                value: String
            },
            system: {
                value: String
            },
            code: {
                value: String
            }
        },
        deceasedRange: {
        },
        deceasedString: {
            value: String
        },
        note: {
            value: String
        },
        condition: [{
            type: {
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
            outcome: {
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
            onsetAge: {
                value: {
                    value: String
                },
                units: {
                    value: String
                },
                system: {
                    value: String
                },
                code: {
                    value: String
                }
            },
            onsetRange: {
            },
            onsetString: {
                value: String
            },
            note: {
                value: String
            }
        }]
    }]
});

mongoose.model('FamilyHistory', FamilyHistorySchema);
