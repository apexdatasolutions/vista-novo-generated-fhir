// This file contains the configuration for VistA based services
// that will be called to pull in information to be translated
// into FHIR
exports.observations = {
  url: "http://localhost:3001/api/observations/",
  username: 'andy@mitre.org',
  password: 'splatter'
};

exports.patients = {
  url: "http://localhost:3001/api/patients/",
  username: 'andy@mitre.org',
  password: 'splatter'
};

exports.medications = {
  url: "http://localhost:3001/api/medications/",
  username: 'andy@mitre.org',
  password: 'splatter'
};

exports.conditions = {
  url: "http://localhost:3001/api/conditions/",
  username: 'andy@mitre.org',
  password: 'splatter'
};
