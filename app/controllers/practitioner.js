var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Practitioner = mongoose.model('Practitioner');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, practitioner) {
        req.practitioner = practitioner;
        next(practitioner);
      });
    } else {
      req.resourceHistory.findLatest(function(err, practitioner) {
        req.practitioner = practitioner;
        next(practitioner);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, practitioner) {
          req.practitioner = practitioner;
          next(practitioner);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var practitioner = req.practitioner;
  var json = JSON.stringify(practitioner);
  res.send(json);
};

exports.create = function(req, res) {
  var practitioner = new Practitioner(req.body);
  practitioner.save(function(err, savedPractitioner) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Practitioner'});
      resourceHistory.addVersion(savedPractitioner.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/practitioner/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var practitioner = req.practitioner;
  practitioner = _.extend(practitioner, req.body);
  practitioner.save(function(err, savedpractitioner) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedpractitioner);
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
  var practitioner = req.practitioner;
  practitioner.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Practitioner",
    id: "http://localhost:3000/practitioner",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/practitioner",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Practitioner"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, practitioner) {
        var entrywrapper = {
          title: "Practitioner " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/practitioner/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/practitioner/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: practitioner
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};