var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var SecurityEvent = mongoose.model('SecurityEvent');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, securityevent) {
        req.securityevent = securityevent;
        next(securityevent);
      });
    } else {
      req.resourceHistory.findLatest(function(err, securityevent) {
        req.securityevent = securityevent;
        next(securityevent);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, securityevent) {
          req.securityevent = securityevent;
          next(securityevent);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var securityevent = req.securityevent;
  var json = JSON.stringify(securityevent);
  res.send(json);
};

exports.create = function(req, res) {
  var securityevent = new SecurityEvent(req.body);
  securityevent.save(function(err, savedSecurityEvent) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'SecurityEvent'});
      resourceHistory.addVersion(savedSecurityEvent.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/securityevent/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var securityevent = req.securityevent;
  securityevent = _.extend(securityevent, req.body);
  securityevent.save(function(err, savedsecurityevent) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedsecurityevent);
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
  var securityevent = req.securityevent;
  securityevent.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type SecurityEvent",
    id: "http://localhost:3000/securityevent",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/securityevent",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Patient"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, securityevent) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/securityevent/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/securityevent/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: securityevent
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no securityevent found');
      res.send(500);
    }
  });
};