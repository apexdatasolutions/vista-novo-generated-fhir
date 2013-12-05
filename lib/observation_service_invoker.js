var restler  = require('restler');
var mongoose = require('mongoose');
var _ = require('underscore');
var Observation = mongoose.model('Observation');
var ResourceHistory = mongoose.model('ResourceHistory');

exports.checkObservationCache = function(req, res, next, model) {
  if (model === 'observation') {
    var observationId = req.params.id;
    ResourceHistory.findInCacheOrLocal(observationId, 'Observation', function(resourceHistory) {
      if (resourceHistory) {
        // we already have the resource, let's use it
        // in the future we can check to see if we need to refresh the cached copy
        req.resourceHistory = resourceHistory;
        next();
      } else {
        // fetch from the backend service
        var requestUrl = "http://localhost:3001/admin/observation/" + observationId + ".json";
        // XXX: Remove hardcoded credentials - extract to config file
        restler.get(requestUrl, {username: 'andy@mitre.org', password: 'splatter'}).on('complete', function(vistaObservation) {
          var novoObservation = new Observation();
          novoObservation.name.coding = [{system: "http://loinc.org", code: vistaObservation.name}]
          novoObservation.save(function(err, savedObservation) {          
            if(err) {
              res.send(500);
            } else {
              var newResourceHistory = new ResourceHistory({resourceType: 'Observation', vistaId: req.params.id});
              newResourceHistory.addVersion(savedObservation.id);
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
    next ();
  }
}