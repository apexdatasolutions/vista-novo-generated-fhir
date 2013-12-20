var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MedicationPrescription = mongoose.model('MedicationPrescription');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, medicationprescription) {
        req.medicationprescription = medicationprescription;
        next(medicationprescription);
      });
    } else {
      req.resourceHistory.findLatest(function(err, medicationprescription) {
        req.medicationprescription = medicationprescription;
        next(medicationprescription);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, medicationprescription) {
          req.medicationprescription = medicationprescription;
          next(medicationprescription);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var medicationprescription = req.medicationprescription;
  var json = JSON.stringify(medicationprescription);
  res.send(json);
};

exports.create = function(req, res) {
  var medicationprescription = new MedicationPrescription(req.body);
  medicationprescription.save(function(err, savedMedicationPrescription) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'MedicationPrescription'});
      resourceHistory.addVersion(savedMedicationPrescription.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/medicationprescription/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var medicationprescription = req.medicationprescription;
  medicationprescription = _.extend(medicationprescription, req.body);
  medicationprescription.save(function(err, savedmedicationprescription) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedicationprescription);
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
  var medicationprescription = req.medicationprescription;
  medicationprescription.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type MedicationPrescription",
    id: "http://localhost:3000/medicationprescription",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/medicationprescription",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"MedicationPrescription"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, medicationprescription) {
        var entrywrapper = {
          title: "MedicationPrescription " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/medicationprescription/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/medicationprescription/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: medicationprescription
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};