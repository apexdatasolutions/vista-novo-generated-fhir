var mongoose = require('mongoose');
var _ = require('underscore');
var Device = mongoose.model('Device');
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
      Device.findOne(lookUpId, function(modelErr, device) {
        if (modelErr) {
          return next(modelErr);
        }
        if(device !== null) {
          req.device = device;
          return next();
        }
        else {
          return next(new Error('Device not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var device = req.device;
  var locals = {device: device};
  res.format(ResponseFormatHelper.buildFormatHash('device', locals, res));
};

exports.create = function(req, res) {
  var device = new Device(req.body);
  device.save(function(err, savedDevice) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Device'});
      resourceHistory.addVersion(savedDevice.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/device/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var device = req.device;
  device = _.extend(device, req.body);
  device.save(function(err, saveddevice) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddevice);
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
  var device = req.device;
  device.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};