var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MedicationStatement = mongoose.model('MedicationStatement');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, medicationstatement) {
        req.medicationstatement = medicationstatement;
        next(medicationstatement);
      });
    } else {
      req.resourceHistory.findLatest(function(err, medicationstatement) {
        req.medicationstatement = medicationstatement;
        next(medicationstatement);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, medicationstatement) {
          req.medicationstatement = medicationstatement;
          next(medicationstatement);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var medicationstatement = req.medicationstatement;
  var json = JSON.stringify(medicationstatement);
  res.send(json);
};

exports.create = function(req, res) {
  var medicationstatement = new MedicationStatement(req.body);
  medicationstatement.save(function(err, savedMedicationStatement) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'MedicationStatement'});
      resourceHistory.addVersion(savedMedicationStatement.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/medicationstatement/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var medicationstatement = req.medicationstatement;
  medicationstatement = _.extend(medicationstatement, req.body);
  medicationstatement.save(function(err, savedmedicationstatement) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedicationstatement);
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
  var medicationstatement = req.medicationstatement;
  medicationstatement.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type MedicationStatement",
    id: "http://localhost:3000/medicationstatement",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/medicationstatement",
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
        history.findLatest( function(err, medicationstatement) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/medicationstatement/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/medicationstatement/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: medicationstatement
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no medicationstatement found');
      res.send(500);
    }
  });
};