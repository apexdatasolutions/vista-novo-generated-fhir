var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Observation = mongoose.model('Observation');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, observation) {
        req.observation = observation;
        next(observation);
      });
    } else {
      req.resourceHistory.findLatest(function(err, observation) {
        req.observation = observation;
        next(observation);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, observation) {
          req.observation = observation;
          next(observation);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var observation = req.observation;
  var json = JSON.stringify(observation);
  res.send(json);
};

exports.create = function(req, res) {
  var observation = new Observation(req.body);
  observation.save(function(err, savedObservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Observation'});
      resourceHistory.addVersion(savedObservation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/observation/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var observation = req.observation;
  observation = _.extend(observation, req.body);
  observation.save(function(err, savedobservation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedobservation);
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
  var observation = req.observation;
  observation.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Observation",
    id: "http://localhost:3000/observation",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/observation",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Observation"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, observation) {
        var entrywrapper = {
          title: "Observation " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/observation/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/observation/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: observation
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};