var mongoose = require('mongoose');
var _ = require('underscore');
var Observation = mongoose.model('Observation');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, observation) {
      req.observation = observation;
      next(observation);
    }); 
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, observation) {
          req.observation = observation;
          next(observation);
        });
      }       
    });
  }
};

exports.show = function(req, res) {
  var observation = req.observation;
  var json = JSON.stringify(observation);
  res.send(json);
};

exports.create = function(req, res) {
  var observation = new Observation(req.body);
  observation.save(function(err, savedObservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Observation'});
      resourceHistory.addVersion(savedObservation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/observation/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var observation = req.observation;
  observation = _.extend(observation, req.body);
  observation.save(function(err, savedobservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedobservation);
      resourceHistory.save(function(rhErr, savedResourceHistory) {
        if (rhErr) {
          res.send(500);
        } else {
          res.send(200);
        }
      });
    }
  });
};

exports.destroy = function(req, res) {
  var observation = req.observation;
  observation.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};