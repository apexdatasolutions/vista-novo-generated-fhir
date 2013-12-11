var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var ConceptMap = mongoose.model('ConceptMap');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, conceptmap) {
        req.conceptmap = conceptmap;
        next(conceptmap);
      });
    } else {
      req.resourceHistory.findLatest(function(err, conceptmap) {
        req.conceptmap = conceptmap;
        next(conceptmap);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, conceptmap) {
          req.conceptmap = conceptmap;
          next(conceptmap);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var conceptmap = req.conceptmap;
  var json = JSON.stringify(conceptmap);
  res.send(json);
};

exports.create = function(req, res) {
  var conceptmap = new ConceptMap(req.body);
  conceptmap.save(function(err, savedConceptMap) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ConceptMap'});
      resourceHistory.addVersion(savedConceptMap.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/conceptmap/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var conceptmap = req.conceptmap;
  conceptmap = _.extend(conceptmap, req.body);
  conceptmap.save(function(err, savedconceptmap) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedconceptmap);
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
  var conceptmap = req.conceptmap;
  conceptmap.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type ConceptMap",
    id: "http://localhost:3000/conceptmap",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/conceptmap",
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
        history.findLatest( function(err, conceptmap) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/conceptmap/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/conceptmap/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: conceptmap
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no conceptmap found');
      res.send(500);
    }
  });
};