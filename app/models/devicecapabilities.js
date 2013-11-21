var mongoose = require('mongoose');

var DeviceCapabilitiesSchema = new mongoose.Schema({
    name: String,
    fhirType: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    },
    manufacturer: String,
    identity: {
        reference: String,
        display: String
    },
    virtualDevice: [{
        code: {
            coding: [{
                system: String,
                code: String,
                display: String
            }]
        },
        channel: [{
            code: {
                coding: [{
                    system: String,
                    code: String,
                    display: String
                }]
            },
            metric: [{
                code: {
                    coding: [{
                        system: String,
                        code: String,
                        display: String
                    }]
                },
                key: String,
                info: {
                    fhirType: String,
                    units: String,
                    ucum: String,
                    template: {
                    },
                    system: String,
                },
                facet: [{
                    code: {
                        coding: [{
                            system: String,
                            code: String,
                            display: String
                        }]
                    },
                    scale: Number,
                    key: String,
                    info: {
                    }
                }]
            }]
        }]
    }]
});

mongoose.model('DeviceCapabilities', DeviceCapabilitiesSchema);
