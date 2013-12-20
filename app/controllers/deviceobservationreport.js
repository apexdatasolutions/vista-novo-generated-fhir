var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var DeviceObservationReport = mongoose.model('DeviceObservationReport');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, deviceobservationreport) {
        req.deviceobservationreport = deviceobservationreport;
        next(deviceobservationreport);
      });
    } else {
      req.resourceHistory.findLatest(function(err, deviceobservationreport) {
        req.deviceobservationreport = deviceobservationreport;
        next(deviceobservationreport);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, deviceobservationreport) {
          req.deviceobservationreport = deviceobservationreport;
          next(deviceobservationreport);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var deviceobservationreport = req.deviceobservationreport;
  var json = JSON.stringify(deviceobservationreport);
  res.send(json);
};

exports.create = function(req, res) {
  var deviceobservationreport = new DeviceObservationReport(req.body);
  deviceobservationreport.save(function(err, savedDeviceObservationReport) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DeviceObservationReport'});
      resourceHistory.addVersion(savedDeviceObservationReport.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/deviceobservationreport/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var deviceobservationreport = req.deviceobservationreport;
  deviceobservationreport = _.extend(deviceobservationreport, req.body);
  deviceobservationreport.save(function(err, saveddeviceobservationreport) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddeviceobservationreport);
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
  var deviceobservationreport = req.deviceobservationreport;
  deviceobservationreport.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type DeviceObservationReport",
    id: "http://localhost:3000/deviceobservationreport",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/deviceobservationreport",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"DeviceObservationReport"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, deviceobservationreport) {
        var entrywrapper = {
          title: "DeviceObservationReport " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/deviceobservationreport/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/deviceobservationreport/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: deviceobservationreport
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};