var mongoose = require('mongoose');
var _ = require('underscore');
var Alert = mongoose.model('Alert');
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
      Alert.findOne(lookUpId, function(modelErr, alert) {
        if (modelErr) {
          return next(modelErr);
        }
        if(alert !== null) {
          req.alert = alert;
          return next();
        }
        else {
          return next(new Error('Alert not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var alert = req.alert;
  var locals = {alert: alert};
  res.format(ResponseFormatHelper.buildFormatHash('alert', locals, res));
};

exports.create = function(req, res) {
  var alert = new Alert(req.body);
  alert.save(function(err, savedAlert) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Alert'});
      resourceHistory.addVersion(savedAlert.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/alert/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var alert = req.alert;
  alert = _.extend(alert, req.body);
  alert.save(function(err, savedalert) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedalert);
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
  var alert = req.alert;
  alert.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};