var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var CarePlan = mongoose.model('CarePlan');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, careplan) {
        req.careplan = careplan;
        next(careplan);
      });
    } else {
      req.resourceHistory.findLatest(function(err, careplan) {
        req.careplan = careplan;
        next(careplan);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, careplan) {
          req.careplan = careplan;
          next(careplan);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var careplan = req.careplan;
  var json = JSON.stringify(careplan);
  res.send(json);
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

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type CarePlan",
    id: "http://localhost:3000/careplan",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/careplan",
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
        history.findLatest( function(err, careplan) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/careplan/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/careplan/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: careplan
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no careplan found');
      res.send(500);
    }
  });
};