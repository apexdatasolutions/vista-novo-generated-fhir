var mongoose = require('mongoose');

var MedicationSchema = new mongoose.Schema({
    name: {
        value: String
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
    isBrand: {
        value: Boolean
    },
    manufacturer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    kind: {
        value: String
    },
    product: {
        form: {
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
        ingredient: [{
            item: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            amount: {
            }
        }]
    },
    package: {
        container: {
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
        content: [{
            item: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            amount: {
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
            }
        }]
    }
});

mongoose.model('Medication', MedicationSchema);
