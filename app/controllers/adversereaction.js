var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var AdverseReaction = mongoose.model('AdverseReaction');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, adversereaction) {
        req.adversereaction = adversereaction;
        next(adversereaction);
      });
    } else {
      req.resourceHistory.findLatest(function(err, adversereaction) {
        req.adversereaction = adversereaction;
        next(adversereaction);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, adversereaction) {
          req.adversereaction = adversereaction;
          next(adversereaction);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var adversereaction = req.adversereaction;
  var json = JSON.stringify(adversereaction);
  res.send(json);
};

exports.create = function(req, res) {
  var adversereaction = new AdverseReaction(req.body);
  adversereaction.save(function(err, savedAdverseReaction) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'AdverseReaction'});
      resourceHistory.addVersion(savedAdverseReaction.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/adversereaction/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var adversereaction = req.adversereaction;
  adversereaction = _.extend(adversereaction, req.body);
  adversereaction.save(function(err, savedadversereaction) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedadversereaction);
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
  var adversereaction = req.adversereaction;
  adversereaction.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type AdverseReaction",
    id: "http://localhost:3000/adversereaction",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/adversereaction",
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
        history.findLatest( function(err, adversereaction) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/adversereaction/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/adversereaction/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: adversereaction
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no adversereaction found');
      res.send(500);
    }
  });
};