var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var FamilyHistory = mongoose.model('FamilyHistory');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, familyhistory) {
        req.familyhistory = familyhistory;
        next(familyhistory);
      });
    } else {
      req.resourceHistory.findLatest(function(err, familyhistory) {
        req.familyhistory = familyhistory;
        next(familyhistory);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, familyhistory) {
          req.familyhistory = familyhistory;
          next(familyhistory);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var familyhistory = req.familyhistory;
  var json = JSON.stringify(familyhistory);
  res.send(json);
};

exports.create = function(req, res) {
  var familyhistory = new FamilyHistory(req.body);
  familyhistory.save(function(err, savedFamilyHistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'FamilyHistory'});
      resourceHistory.addVersion(savedFamilyHistory.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/familyhistory/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var familyhistory = req.familyhistory;
  familyhistory = _.extend(familyhistory, req.body);
  familyhistory.save(function(err, savedfamilyhistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedfamilyhistory);
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
  var familyhistory = req.familyhistory;
  familyhistory.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type FamilyHistory",
    id: "http://localhost:3000/familyhistory",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/familyhistory",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"FamilyHistory"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, familyhistory) {
          var entrywrapper = {
            title: "FamilyHistory " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/familyhistory/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/familyhistory/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: familyhistory
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no familyhistory found');
      res.send(500);
    }
  });
};