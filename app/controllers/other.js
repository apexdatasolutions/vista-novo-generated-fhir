var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Other = mongoose.model('Other');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, other) {
        req.other = other;
        next(other);
      });
    } else {
      req.resourceHistory.findLatest(function(err, other) {
        req.other = other;
        next(other);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, other) {
          req.other = other;
          next(other);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var other = req.other;
  var json = JSON.stringify(other);
  res.send(json);
};

exports.create = function(req, res) {
  var other = new Other(req.body);
  other.save(function(err, savedOther) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Other'});
      resourceHistory.addVersion(savedOther.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/other/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var other = req.other;
  other = _.extend(other, req.body);
  other.save(function(err, savedother) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedother);
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
  var other = req.other;
  other.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Other",
    id: "http://localhost:3000/other",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/other",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Other"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, other) {
          var entrywrapper = {
            title: "Other " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/other/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/other/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: other
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no other found');
      res.send(500);
    }
  });
};