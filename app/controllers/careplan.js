var mongoose = require('mongoose');
var _ = require('underscore');
var CarePlan = mongoose.model('CarePlan');
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
      CarePlan.findOne(lookUpId, function(modelErr, careplan) {
        if (modelErr) {
          return next(modelErr);
        }
        if(careplan !== null) {
          req.careplan = careplan;
          return next();
        }
        else {
          return next(new Error('CarePlan not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var careplan = req.careplan;
  var locals = {careplan: careplan};
  res.format(ResponseFormatHelper.buildFormatHash('careplan', locals, res));
};

exports.create = function(req, res) {
  var careplan = new CarePlan(req.body);
  careplan.save(function(err, savedCarePlan) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'CarePlan'});
      resourceHistory.addVersion(savedCarePlan.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/careplan/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var careplan = req.careplan;
  careplan = _.extend(careplan, req.body);
  careplan.save(function(err, savedcareplan) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedcareplan);
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
  var careplan = req.careplan;
  careplan.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};