var mongoose = require('mongoose');
var _ = require('underscore');
var Immunization = mongoose.model('Immunization');
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
      Immunization.findOne(lookUpId, function(modelErr, immunization) {
        if (modelErr) {
          return next(modelErr);
        }
        if(immunization !== null) {
          req.immunization = immunization;
          return next();
        }
        else {
          return next(new Error('Immunization not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var immunization = req.immunization;
  var locals = {immunization: immunization};
  res.format(ResponseFormatHelper.buildFormatHash('immunization', locals, res));
};

exports.create = function(req, res) {
  var immunization = new Immunization(req.body);
  immunization.save(function(err, savedImmunization) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Immunization'});
      resourceHistory.addVersion(savedImmunization.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/immunization/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var immunization = req.immunization;
  immunization = _.extend(immunization, req.body);
  immunization.save(function(err, savedimmunization) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedimmunization);
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
  var immunization = req.immunization;
  immunization.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};