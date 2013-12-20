var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MedicationAdministration = mongoose.model('MedicationAdministration');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, medicationadministration) {
        req.medicationadministration = medicationadministration;
        next(medicationadministration);
      });
    } else {
      req.resourceHistory.findLatest(function(err, medicationadministration) {
        req.medicationadministration = medicationadministration;
        next(medicationadministration);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, medicationadministration) {
          req.medicationadministration = medicationadministration;
          next(medicationadministration);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var medicationadministration = req.medicationadministration;
  var json = JSON.stringify(medicationadministration);
  res.send(json);
};

exports.create = function(req, res) {
  var medicationadministration = new MedicationAdministration(req.body);
  medicationadministration.save(function(err, savedMedicationAdministration) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'MedicationAdministration'});
      resourceHistory.addVersion(savedMedicationAdministration.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/medicationadministration/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var medicationadministration = req.medicationadministration;
  medicationadministration = _.extend(medicationadministration, req.body);
  medicationadministration.save(function(err, savedmedicationadministration) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedicationadministration);
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
  var medicationadministration = req.medicationadministration;
  medicationadministration.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type MedicationAdministration",
    id: "http://localhost:3000/medicationadministration",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/medicationadministration",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"MedicationAdministration"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, medicationadministration) {
          var entrywrapper = {
            title: "MedicationAdministration " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/medicationadministration/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/medicationadministration/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: medicationadministration
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no medicationadministration found');
      res.send(500);
    }
  });
};