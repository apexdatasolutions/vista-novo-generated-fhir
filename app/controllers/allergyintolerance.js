var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var AllergyIntolerance = mongoose.model('AllergyIntolerance');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, allergyintolerance) {
        req.allergyintolerance = allergyintolerance;
        next(allergyintolerance);
      });
    } else {
      req.resourceHistory.findLatest(function(err, allergyintolerance) {
        req.allergyintolerance = allergyintolerance;
        next(allergyintolerance);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, allergyintolerance) {
          req.allergyintolerance = allergyintolerance;
          next(allergyintolerance);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var allergyintolerance = req.allergyintolerance;
  var json = JSON.stringify(allergyintolerance);
  res.send(json);
};

exports.create = function(req, res) {
  var allergyintolerance = new AllergyIntolerance(req.body);
  allergyintolerance.save(function(err, savedAllergyIntolerance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'AllergyIntolerance'});
      resourceHistory.addVersion(savedAllergyIntolerance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/allergyintolerance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var allergyintolerance = req.allergyintolerance;
  allergyintolerance = _.extend(allergyintolerance, req.body);
  allergyintolerance.save(function(err, savedallergyintolerance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedallergyintolerance);
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
  var allergyintolerance = req.allergyintolerance;
  allergyintolerance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type AllergyIntolerance",
    id: "http://localhost:3000/allergyintolerance",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/allergyintolerance",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"AllergyIntolerance"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, allergyintolerance) {
        var entrywrapper = {
          title: "AllergyIntolerance " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/allergyintolerance/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/allergyintolerance/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: allergyintolerance
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};