var mongoose = require('mongoose');
var _ = require('underscore');
var DeviceObservation = mongoose.model('DeviceObservation');
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
      DeviceObservation.findOne(lookUpId, function(modelErr, deviceobservation) {
        if (modelErr) {
          return next(modelErr);
        }
        if(deviceobservation !== null) {
          req.deviceobservation = deviceobservation;
          return next();
        }
        else {
          return next(new Error('DeviceObservation not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var deviceobservation = req.deviceobservation;
  var locals = {deviceobservation: deviceobservation};
  res.format(ResponseFormatHelper.buildFormatHash('deviceobservation', locals, res));
};

exports.create = function(req, res) {
  var deviceobservation = new DeviceObservation(req.body);
  deviceobservation.save(function(err, savedDeviceObservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DeviceObservation'});
      resourceHistory.addVersion(savedDeviceObservation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/deviceobservation/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var deviceobservation = req.deviceobservation;
  deviceobservation = _.extend(deviceobservation, req.body);
  deviceobservation.save(function(err, saveddeviceobservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddeviceobservation);
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
  var deviceobservation = req.deviceobservation;
  deviceobservation.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};