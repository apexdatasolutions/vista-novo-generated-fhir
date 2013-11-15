var mongoose = require('mongoose');

var ProfileSchema = new mongoose.Schema({
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
    code: [{
        system: {
            value: String
        },
        code: {
            value: String
        },
        display: {
            value: String
        }
    }],
    status: {
        value: String
    },
    experimental: {
        value: Boolean
    },
    date: {
        value: Date
    },
    fhirVersion: {
    },
    structure: [{
        type: {
            value: String
        },
        name: {
            value: String
        },
        publish: {
            value: Boolean
        },
        purpose: {
            value: String
        },
        element: [{
            path: {
                value: String
            },
            name: {
                value: String
            },
            slicing: {
                discriminator: {
                },
                ordered: {
                    value: Boolean
                },
                rules: {
                    value: String
                }
            },
            definition: {
                short: {
                    value: String
                },
                formal: {
                    value: String
                },
                comments: {
                    value: String
                },
                requirements: {
                    value: String
                },
                synonym: [{
                    value: String
                }],
                min: {
                    value: Number
                },
                max: {
                    value: String
                },
                type: [{
                    code: {
                        value: String
                    },
                    profile: {
                        value: String
                    },
                    aggregation: [{
                        value: String
                    }]
                }],
                nameReference: {
                    value: String
                },
                value: {
                },
                example: {
                },
                maxLength: {
                    value: Number
                },
                condition: [{
                }],
                constraint: [{
                    key: {
                    },
                    name: {
                        value: String
                    },
                    severity: {
                        value: String
                    },
                    human: {
                        value: String
                    },
                    xpath: {
                        value: String
                    }
                }],
                mustSupport: {
                    value: Boolean
                },
                isModifier: {
                    value: Boolean
                },
                binding: {
                    name: {
                        value: String
                    },
                    isExtensible: {
                        value: Boolean
                    },
                    conformance: {
                        value: String
                    },
                    description: {
                        value: String
                    },
                    referenceUri: {
                        value: String
                    },
                    referenceResource: {
                        type: {
                            value: String
                        },
                        reference: {
                            value: String
                        }
                    }
                },
                mapping: [{
                    target: {
                        value: String
                    },
                    map: {
                        value: String
                    }
                }]
            }
        }]
    }],
    extensionDefn: [{
        code: {
            value: String
        },
        display: {
            value: String
        },
        contextType: {
            value: String
        },
        context: [{
            value: String
        }],
        definition: {
        }
    }]
});

mongoose.model('Profile', ProfileSchema);
