var mongoose = require('mongoose');
var _ = require('underscore');
var ImmunizationRecommendation = mongoose.model('ImmunizationRecommendation');
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
      ImmunizationRecommendation.findOne(lookUpId, function(modelErr, immunizationrecommendation) {
        if (modelErr) {
          return next(modelErr);
        }
        if(immunizationrecommendation !== null) {
          req.immunizationrecommendation = immunizationrecommendation;
          return next();
        }
        else {
          return next(new Error('ImmunizationRecommendation not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var immunizationrecommendation = req.immunizationrecommendation;
  var locals = {immunizationrecommendation: immunizationrecommendation};
  res.format(ResponseFormatHelper.buildFormatHash('immunizationrecommendation', locals, res));
};

exports.create = function(req, res) {
  var immunizationrecommendation = new ImmunizationRecommendation(req.body);
  immunizationrecommendation.save(function(err, savedImmunizationRecommendation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ImmunizationRecommendation'});
      resourceHistory.addVersion(savedImmunizationRecommendation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/immunizationrecommendation/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var immunizationrecommendation = req.immunizationrecommendation;
  immunizationrecommendation = _.extend(immunizationrecommendation, req.body);
  immunizationrecommendation.save(function(err, savedimmunizationrecommendation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedimmunizationrecommendation);
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
  var immunizationrecommendation = req.immunizationrecommendation;
  immunizationrecommendation.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};