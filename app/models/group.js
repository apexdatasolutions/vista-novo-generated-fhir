var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    identifier: {
    },
    type: {
        value: String
    },
    actual: {
        value: Boolean
    },
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
    name: {
        value: String
    },
    quantity: {
        value: Number
    },
    characteristic: [{
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
        valueCodeableConcept: {
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
        valueString: {
            value: String
        },
        valueBoolean: {
            value: Boolean
        },
        valueQuantity: {
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
        valueRange: {
        },
        exclude: {
            value: Boolean
        }
    }],
    member: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('Group', GroupSchema);
