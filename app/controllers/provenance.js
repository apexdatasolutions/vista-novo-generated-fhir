var mongoose = require('mongoose');
var _ = require('underscore');
var Provenance = mongoose.model('Provenance');
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
      Provenance.findOne(lookUpId, function(modelErr, provenance) {
        if (modelErr) {
          return next(modelErr);
        }
        if(provenance !== null) {
          req.provenance = provenance;
          return next();
        }
        else {
          return next(new Error('Provenance not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var provenance = req.provenance;
  var locals = {provenance: provenance};
  res.format(ResponseFormatHelper.buildFormatHash('provenance', locals, res));
};

exports.create = function(req, res) {
  var provenance = new Provenance(req.body);
  provenance.save(function(err, savedProvenance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Provenance'});
      resourceHistory.addVersion(savedProvenance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/provenance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var provenance = req.provenance;
  provenance = _.extend(provenance, req.body);
  provenance.save(function(err, savedprovenance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedprovenance);
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
  var provenance = req.provenance;
  provenance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};