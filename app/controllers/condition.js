var mongoose = require('mongoose');
var _ = require('underscore');
var Condition = mongoose.model('Condition');
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
      Condition.findOne(lookUpId, function(modelErr, condition) {
        if (modelErr) {
          return next(modelErr);
        }
        if(condition !== null) {
          req.condition = condition;
          return next();
        }
        else {
          return next(new Error('Condition not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var condition = req.condition;
  var locals = {condition: condition};
  res.format(ResponseFormatHelper.buildFormatHash('condition', locals, res));
};

exports.create = function(req, res) {
  var condition = new Condition(req.body);
  condition.save(function(err, savedCondition) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Condition'});
      resourceHistory.addVersion(savedCondition.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/condition/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var condition = req.condition;
  condition = _.extend(condition, req.body);
  condition.save(function(err, savedcondition) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedcondition);
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
  var condition = req.condition;
  condition.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};