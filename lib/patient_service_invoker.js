var restler  = require('restler');
var mongoose = require('mongoose');
var _ = require('underscore');
var Patient = mongoose.model('Patient');
var ResourceHistory = mongoose.model('ResourceHistory');

exports.checkPatientCache = function(req, res, next, model) {
  if (model === 'patient') {
    var patientId = req.params.id;
    ResourceHistory.findInCacheOrLocal(patientId, 'Patient', function(resourceHistory) {
      if (resourceHistory) {
        // we already have the resource, let's use it
        // in the future we can check to see if we need to refresh the cached copy
        req.resourceHistory = resourceHistory;
        next();
      } else {
        // fetch from the backend service
        var requestUrl = "http://localhost:3001/admin/patient/" + patientId + ".json";
        // XXX: Remove hardcoded credentials - extract to config file
        restler.get(requestUrl, {username: 'andy@mitre.org', password: 'splatter'}).on('complete', function(vistaPatient) {
          var novoPatient = new Patient();
          novoPatient.gender.coding = [{system: "http://hl7.org/fhir/v3/AdministrativeGender", code: vistaPatient.gender}]
          novoPatient.save(function(err, savedPatient) {          
            if(err) {
              res.send(500);
            } else {
              var newResourceHistory = new ResourceHistory({resourceType: 'Patient', vistaId: req.params.id});
              newResourceHistory.addVersion(savedPatient.id);
              newResourceHistory.save(function(rhError, savedResourceHistory) {
                req.resourceHistory = savedResourceHistory;
                next();
              });
            }
          });        
        });
      }
    });
  } else {
    next();
  }
}