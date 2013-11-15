var mongoose = require('mongoose');
var _ = require('underscore');
var Encounter = mongoose.model('Encounter');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, next, id, vid) {
  ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
    if (rhErr) {
      return next(rhErr);
    }
    if(resourceHistory !== null) {
      req.resourceHistory = resourceHistory;
      var lookUpId = null;
      if (vid !== null) {
        lookUpId = vid;
      } else {
        lookUpId = resourceHistory.latestVersionId();
      }
      Encounter.findOne(lookUpId, function(modelErr, encounter) {
        if (modelErr) {
          return next(modelErr);
        }
        if(encounter !== null) {
          req.encounter = encounter;
          return next();
        }
        else {
          return next(new Error('Encounter not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var encounter = req.encounter;
  var locals = {encounter: encounter};
  res.format(ResponseFormatHelper.buildFormatHash('encounter', locals, res));
};

exports.create = function(req, res) {
  var encounter = new Encounter(req.body);
  encounter.save(function(err, savedEncounter) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Encounter'});
      resourceHistory.addVersion(savedEncounter.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/encounter/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var encounter = req.encounter;
  encounter = _.extend(encounter, req.body);
  encounter.save(function(err, savedencounter) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedencounter);
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
  var encounter = req.encounter;
  encounter.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};