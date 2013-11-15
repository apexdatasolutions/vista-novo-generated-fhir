var mongoose = require('mongoose');
var _ = require('underscore');
var FamilyHistory = mongoose.model('FamilyHistory');
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
      FamilyHistory.findOne(lookUpId, function(modelErr, familyhistory) {
        if (modelErr) {
          return next(modelErr);
        }
        if(familyhistory !== null) {
          req.familyhistory = familyhistory;
          return next();
        }
        else {
          return next(new Error('FamilyHistory not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var familyhistory = req.familyhistory;
  var locals = {familyhistory: familyhistory};
  res.format(ResponseFormatHelper.buildFormatHash('familyhistory', locals, res));
};

exports.create = function(req, res) {
  var familyhistory = new FamilyHistory(req.body);
  familyhistory.save(function(err, savedFamilyHistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'FamilyHistory'});
      resourceHistory.addVersion(savedFamilyHistory.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/familyhistory/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var familyhistory = req.familyhistory;
  familyhistory = _.extend(familyhistory, req.body);
  familyhistory.save(function(err, savedfamilyhistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedfamilyhistory);
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
  var familyhistory = req.familyhistory;
  familyhistory.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};