var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Conformance = mongoose.model('Conformance');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, conformance) {
        req.conformance = conformance;
        next(conformance);
      });
    } else {
      req.resourceHistory.findLatest(function(err, conformance) {
        req.conformance = conformance;
        next(conformance);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, conformance) {
          req.conformance = conformance;
          next(conformance);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var conformance = req.conformance;
  var json = JSON.stringify(conformance);
  res.send(json);
};

exports.create = function(req, res) {
  var conformance = new Conformance(req.body);
  conformance.save(function(err, savedConformance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Conformance'});
      resourceHistory.addVersion(savedConformance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/conformance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var conformance = req.conformance;
  conformance = _.extend(conformance, req.body);
  conformance.save(function(err, savedconformance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedconformance);
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
  var conformance = req.conformance;
  conformance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Conformance",
    id: "http://localhost:3000/conformance",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/conformance",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Conformance"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, conformance) {
        var entrywrapper = {
          title: "Conformance " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/conformance/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/conformance/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: conformance
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};