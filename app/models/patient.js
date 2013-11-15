var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema({
    identifier: [{
    }],
    name: [{
    }],
    telecom: [{
    }],
    gender: {
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
    birthDate: {
        value: Date
    },
    deceasedBoolean: {
        value: Boolean
    },
    deceasedDateTime: {
        value: Date
    },
    address: [{
    }],
    maritalStatus: {
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
    multipleBirthBoolean: {
        value: Boolean
    },
    multipleBirthInteger: {
        value: Number
    },
    photo: [{
    }],
    contact: [{
        relationship: [{
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
        name: {
        },
        telecom: [{
        }],
        address: {
        },
        gender: {
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
        organization: {
            type: {
                value: String
            },
            reference: {
                value: String
            }
        }
    }],
    animal: {
        species: {
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
        breed: {
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
        genderStatus: {
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
        }
    },
    communication: [{
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
    provider: {
        type: {
            value: String
        },
        reference: {
            value: String
        }
    },
    link: [{
        type: {
            value: String
        },
        reference: {
            value: String
        }
    }],
    active: {
        value: Boolean
    }
});

mongoose.model('Patient', PatientSchema);
