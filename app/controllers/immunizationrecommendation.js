var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var ImmunizationRecommendation = mongoose.model('ImmunizationRecommendation');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, immunizationrecommendation) {
        req.immunizationrecommendation = immunizationrecommendation;
        next(immunizationrecommendation);
      });
    } else {
      req.resourceHistory.findLatest(function(err, immunizationrecommendation) {
        req.immunizationrecommendation = immunizationrecommendation;
        next(immunizationrecommendation);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, immunizationrecommendation) {
          req.immunizationrecommendation = immunizationrecommendation;
          next(immunizationrecommendation);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var immunizationrecommendation = req.immunizationrecommendation;
  var json = JSON.stringify(immunizationrecommendation);
  res.send(json);
};

exports.create = function(req, res) {
  var immunizationrecommendation = new ImmunizationRecommendation(req.body);
  immunizationrecommendation.save(function(err, savedImmunizationRecommendation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ImmunizationRecommendation'});
      resourceHistory.addVersion(savedImmunizationRecommendation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/immunizationrecommendation/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var immunizationrecommendation = req.immunizationrecommendation;
  immunizationrecommendation = _.extend(immunizationrecommendation, req.body);
  immunizationrecommendation.save(function(err, savedimmunizationrecommendation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedimmunizationrecommendation);
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
  var immunizationrecommendation = req.immunizationrecommendation;
  immunizationrecommendation.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type ImmunizationRecommendation",
    id: "http://localhost:3000/immunizationrecommendation",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/immunizationrecommendation",
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
        history.findLatest( function(err, immunizationrecommendation) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/immunizationrecommendation/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/immunizationrecommendation/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: immunizationrecommendation
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no immunizationrecommendation found');
      res.send(500);
    }
  });
};