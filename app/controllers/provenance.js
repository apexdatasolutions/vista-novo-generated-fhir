var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Provenance = mongoose.model('Provenance');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, provenance) {
        req.provenance = provenance;
        next(provenance);
      });
    } else {
      req.resourceHistory.findLatest(function(err, provenance) {
        req.provenance = provenance;
        next(provenance);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, provenance) {
          req.provenance = provenance;
          next(provenance);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var provenance = req.provenance;
  var json = JSON.stringify(provenance);
  res.send(json);
};

exports.create = function(req, res) {
  var provenance = new Provenance(req.body);
  provenance.save(function(err, savedProvenance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Provenance'});
      resourceHistory.addVersion(savedProvenance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/provenance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var provenance = req.provenance;
  provenance = _.extend(provenance, req.body);
  provenance.save(function(err, savedprovenance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedprovenance);
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
  var provenance = req.provenance;
  provenance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Provenance",
    id: "http://localhost:3000/provenance",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/provenance",
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
        history.findLatest( function(err, provenance) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/provenance/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/provenance/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: provenance
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no provenance found');
      res.send(500);
    }
  });
};