var mongoose = require('mongoose');

var DeviceCapabilitiesSchema = new mongoose.Schema({
    name: {
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
    manufacturer: {
        value: String
    },
    identity: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    virtualDevice: [{
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
        channel: [{
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
            metric: [{
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
                key: {
                    value: String
                },
                info: {
                    type: {
                        value: String
                    },
                    units: {
                        value: String
                    },
                    ucum: {
                        value: String
                    },
                    template: {
                    },
                    system: {
                        value: String
                    }
                },
                facet: [{
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
                    scale: {
                        value: Number
                    },
                    key: {
                        value: String
                    },
                    info: {
                    }
                }]
            }]
        }]
    }]
});

mongoose.model('DeviceCapabilities', DeviceCapabilitiesSchema);
