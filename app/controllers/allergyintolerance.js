var mongoose = require('mongoose');
var _ = require('underscore');
var AllergyIntolerance = mongoose.model('AllergyIntolerance');
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
      AllergyIntolerance.findOne(lookUpId, function(modelErr, allergyintolerance) {
        if (modelErr) {
          return next(modelErr);
        }
        if(allergyintolerance !== null) {
          req.allergyintolerance = allergyintolerance;
          return next();
        }
        else {
          return next(new Error('AllergyIntolerance not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var allergyintolerance = req.allergyintolerance;
  var locals = {allergyintolerance: allergyintolerance};
  res.format(ResponseFormatHelper.buildFormatHash('allergyintolerance', locals, res));
};

exports.create = function(req, res) {
  var allergyintolerance = new AllergyIntolerance(req.body);
  allergyintolerance.save(function(err, savedAllergyIntolerance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'AllergyIntolerance'});
      resourceHistory.addVersion(savedAllergyIntolerance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/allergyintolerance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var allergyintolerance = req.allergyintolerance;
  allergyintolerance = _.extend(allergyintolerance, req.body);
  allergyintolerance.save(function(err, savedallergyintolerance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedallergyintolerance);
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
  var allergyintolerance = req.allergyintolerance;
  allergyintolerance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};