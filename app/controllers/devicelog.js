var mongoose = require('mongoose');
var _ = require('underscore');
var DeviceLog = mongoose.model('DeviceLog');
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
      DeviceLog.findOne(lookUpId, function(modelErr, devicelog) {
        if (modelErr) {
          return next(modelErr);
        }
        if(devicelog !== null) {
          req.devicelog = devicelog;
          return next();
        }
        else {
          return next(new Error('DeviceLog not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var devicelog = req.devicelog;
  var locals = {devicelog: devicelog};
  res.format(ResponseFormatHelper.buildFormatHash('devicelog', locals, res));
};

exports.create = function(req, res) {
  var devicelog = new DeviceLog(req.body);
  devicelog.save(function(err, savedDeviceLog) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DeviceLog'});
      resourceHistory.addVersion(savedDeviceLog.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/devicelog/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var devicelog = req.devicelog;
  devicelog = _.extend(devicelog, req.body);
  devicelog.save(function(err, saveddevicelog) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddevicelog);
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
  var devicelog = req.devicelog;
  devicelog.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};