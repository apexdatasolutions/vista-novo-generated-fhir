var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    identifier: {
    },
    timestamp: {
        value: Date
    },
    event: {
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
    response: {
        identifier: {
        },
        code: {
            value: String
        },
        details: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    },
    source: {
        name: {
            value: String
        },
        software: {
            value: String
        },
        version: {
            value: String
        },
        contact: {
        },
        endpoint: {
            value: String
        }
    },
    destination: [{
        name: {
            value: String
        },
        target: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        },
        endpoint: {
            value: String
        }
    }],
    enterer: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    author: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    receiver: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    responsible: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    reason: {
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
    data: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('Message', MessageSchema);
