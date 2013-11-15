var mongoose = require('mongoose');

var SupplySchema = new mongoose.Schema({
    name: {
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
    identifier: {
    },
    status: {
        value: String
    },
    orderedItem: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    patient: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    dispense: [{
        identifier: {
        },
        status: {
            value: String
        },
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
        quantity: {
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
        suppliedItem: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        supplier: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        whenPrepared: {
        },
        whenHandedOver: {
        },
        destination: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        receiver: [{
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }]
    }]
});

mongoose.model('Supply', SupplySchema);
