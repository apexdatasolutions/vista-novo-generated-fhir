var mongoose = require('mongoose');
var _ = require('underscore');
var Conformance = mongoose.model('Conformance');
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
      Conformance.findOne(lookUpId, function(modelErr, conformance) {
        if (modelErr) {
          return next(modelErr);
        }
        if(conformance !== null) {
          req.conformance = conformance;
          return next();
        }
        else {
          return next(new Error('Conformance not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var conformance = req.conformance;
  var locals = {conformance: conformance};
  res.format(ResponseFormatHelper.buildFormatHash('conformance', locals, res));
};

exports.create = function(req, res) {
  var conformance = new Conformance(req.body);
  conformance.save(function(err, savedConformance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Conformance'});
      resourceHistory.addVersion(savedConformance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/conformance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var conformance = req.conformance;
  conformance = _.extend(conformance, req.body);
  conformance.save(function(err, savedconformance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedconformance);
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
  var conformance = req.conformance;
  conformance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};