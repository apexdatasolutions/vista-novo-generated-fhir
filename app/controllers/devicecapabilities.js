var mongoose = require('mongoose');
var _ = require('underscore');
var DeviceCapabilities = mongoose.model('DeviceCapabilities');
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
      DeviceCapabilities.findOne(lookUpId, function(modelErr, devicecapabilities) {
        if (modelErr) {
          return next(modelErr);
        }
        if(devicecapabilities !== null) {
          req.devicecapabilities = devicecapabilities;
          return next();
        }
        else {
          return next(new Error('DeviceCapabilities not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var devicecapabilities = req.devicecapabilities;
  var locals = {devicecapabilities: devicecapabilities};
  res.format(ResponseFormatHelper.buildFormatHash('devicecapabilities', locals, res));
};

exports.create = function(req, res) {
  var devicecapabilities = new DeviceCapabilities(req.body);
  devicecapabilities.save(function(err, savedDeviceCapabilities) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DeviceCapabilities'});
      resourceHistory.addVersion(savedDeviceCapabilities.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/devicecapabilities/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var devicecapabilities = req.devicecapabilities;
  devicecapabilities = _.extend(devicecapabilities, req.body);
  devicecapabilities.save(function(err, saveddevicecapabilities) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddevicecapabilities);
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
  var devicecapabilities = req.devicecapabilities;
  devicecapabilities.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};