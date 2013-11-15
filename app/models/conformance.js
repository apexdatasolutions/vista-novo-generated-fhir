var mongoose = require('mongoose');

var ConformanceSchema = new mongoose.Schema({
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
    status: {
        value: String
    },
    experimental: {
        value: Boolean
    },
    date: {
        value: Date
    },
    software: {
        name: {
            value: String
        },
        version: {
            value: String
        },
        releaseDate: {
            value: Date
        }
    },
    implementation: {
        description: {
            value: String
        },
        url: {
            value: String
        }
    },
    fhirVersion: {
    },
    acceptUnknown: {
        value: Boolean
    },
    format: [{
        value: String
    }],
    profile: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    rest: [{
        mode: {
            value: String
        },
        documentation: {
            value: String
        },
        security: {
            cors: {
                value: Boolean
            },
            service: [{
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
            }],
            description: {
                value: String
            },
            certificate: [{
                type: {
                    value: String
                },
                blob: {
                }
            }]
        },
        resource: [{
            type: {
                value: String
            },
            profile: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            operation: [{
                code: {
                    value: String
                },
                documentation: {
                    value: String
                }
            }],
            readHistory: {
                value: Boolean
            },
            updateCreate: {
                value: Boolean
            },
            searchInclude: [{
                value: String
            }],
            searchParam: [{
                name: {
                    value: String
                },
                source: {
                    value: String
                },
                type: {
                    value: String
                },
                documentation: {
                    value: String
                },
                xpath: {
                    value: String
                },
                target: [{
                    value: String
                }],
                chain: [{
                    value: String
                }]
            }]
        }],
        operation: [{
            code: {
                value: String
            },
            documentation: {
                value: String
            }
        }],
        query: [{
            name: {
                value: String
            },
            documentation: {
                value: String
            },
            parameter: [{
            }]
        }]
    }],
    messaging: [{
        endpoint: {
            value: String
        },
        reliableCache: {
            value: Number
        },
        documentation: {
            value: String
        },
        event: [{
            code: {
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
            mode: {
                value: String
            },
            protocol: [{
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
            focus: {
                value: String
            },
            request: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            response: {
                type: {
                    value: String
                },
                reference: {
                    value: String
                }
            },
            documentation: {
                value: String
            }
        }]
    }],
    document: [{
        mode: {
            value: String
        },
        documentation: {
            value: String
        },
        profile: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }]
});

mongoose.model('Conformance', ConformanceSchema);
