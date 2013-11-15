var mongoose = require('mongoose');

var OrderResponseSchema = new mongoose.Schema({
    request: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    date: {
        value: Date
    },
    who: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    authority: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    cost: {
    },
    code: {
        value: String
    },
    description: {
        value: String
    },
    fulfillment: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }]
});

mongoose.model('OrderResponse', OrderResponseSchema);
