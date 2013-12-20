var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Substance = mongoose.model('Substance');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, substance) {
        req.substance = substance;
        next(substance);
      });
    } else {
      req.resourceHistory.findLatest(function(err, substance) {
        req.substance = substance;
        next(substance);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, substance) {
          req.substance = substance;
          next(substance);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var substance = req.substance;
  var json = JSON.stringify(substance);
  res.send(json);
};

exports.create = function(req, res) {
  var substance = new Substance(req.body);
  substance.save(function(err, savedSubstance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Substance'});
      resourceHistory.addVersion(savedSubstance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/substance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var substance = req.substance;
  substance = _.extend(substance, req.body);
  substance.save(function(err, savedsubstance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedsubstance);
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
  var substance = req.substance;
  substance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Substance",
    id: "http://localhost:3000/substance",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/substance",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Substance"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, substance) {
        var entrywrapper = {
          title: "Substance " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/substance/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/substance/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: substance
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};