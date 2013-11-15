var mongoose = require('mongoose');

var ValueSetSchema = new mongoose.Schema({
    identifier: {
        value: String
    },
    version: {
        value: String
    },
    name: {
        value: String
    },
    publisher: {
        value: String
    },
    telecom: [{
    }],
    description: {
        value: String
    },
    copyright: {
        value: String
    },
    status: {
        value: String
    },
    experimental: {
        value: Boolean
    },
    extensible: {
        value: Boolean
    },
    date: {
        value: Date
    },
    define: {
        system: {
            value: String
        },
        version: {
            value: String
        },
        caseSensitive: {
            value: Boolean
        },
        concept: [{
            code: {
                value: String
            },
            abstract: {
                value: Boolean
            },
            display: {
                value: String
            },
            definition: {
                value: String
            },
            concept: [{
            }]
        }]
    },
    compose: {
        import: [{
            value: String
        }],
        include: [{
            system: {
                value: String
            },
            version: {
                value: String
            },
            code: [{
                value: String
            }],
            filter: [{
                property: {
                    value: String
                },
                op: {
                    value: String
                },
                value: {
                    value: String
                }
            }]
        }],
        exclude: [{
        }]
    },
    expansion: {
        identifier: {
        },
        timestamp: {
            value: Date
        },
        contains: [{
            system: {
                value: String
            },
            code: {
                value: String
            },
            display: {
                value: String
            },
            contains: [{
            }]
        }]
    }
});

mongoose.model('ValueSet', ValueSetSchema);
