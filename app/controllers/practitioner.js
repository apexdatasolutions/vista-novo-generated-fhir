var mongoose = require('mongoose');
var _ = require('underscore');
var Practitioner = mongoose.model('Practitioner');
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
      Practitioner.findOne(lookUpId, function(modelErr, practitioner) {
        if (modelErr) {
          return next(modelErr);
        }
        if(practitioner !== null) {
          req.practitioner = practitioner;
          return next();
        }
        else {
          return next(new Error('Practitioner not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var practitioner = req.practitioner;
  var locals = {practitioner: practitioner};
  res.format(ResponseFormatHelper.buildFormatHash('practitioner', locals, res));
};

exports.create = function(req, res) {
  var practitioner = new Practitioner(req.body);
  practitioner.save(function(err, savedPractitioner) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Practitioner'});
      resourceHistory.addVersion(savedPractitioner.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/practitioner/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var practitioner = req.practitioner;
  practitioner = _.extend(practitioner, req.body);
  practitioner.save(function(err, savedpractitioner) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedpractitioner);
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
  var practitioner = req.practitioner;
  practitioner.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};