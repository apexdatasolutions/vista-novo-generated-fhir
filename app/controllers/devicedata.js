var mongoose = require('mongoose');
var _ = require('underscore');
var DeviceData = mongoose.model('DeviceData');
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
      DeviceData.findOne(lookUpId, function(modelErr, devicedata) {
        if (modelErr) {
          return next(modelErr);
        }
        if(devicedata !== null) {
          req.devicedata = devicedata;
          return next();
        }
        else {
          return next(new Error('DeviceData not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var devicedata = req.devicedata;
  var locals = {devicedata: devicedata};
  res.format(ResponseFormatHelper.buildFormatHash('devicedata', locals, res));
};

exports.create = function(req, res) {
  var devicedata = new DeviceData(req.body);
  devicedata.save(function(err, savedDeviceData) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DeviceData'});
      resourceHistory.addVersion(savedDeviceData.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/devicedata/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var devicedata = req.devicedata;
  devicedata = _.extend(devicedata, req.body);
  devicedata.save(function(err, saveddevicedata) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddevicedata);
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
  var devicedata = req.devicedata;
  devicedata.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};