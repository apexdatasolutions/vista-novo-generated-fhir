var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Patient = mongoose.model('Patient');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, patient) {
        req.patient = patient;
        next(patient);
      });
    } else {
      req.resourceHistory.findLatest(function(err, patient) {
        req.patient = patient;
        next(patient);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, patient) {
          req.patient = patient;
          next(patient);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var patient = req.patient;
  var json = JSON.stringify(patient);
  res.send(json);
};

exports.create = function(req, res) {
  var patient = new Patient(req.body);
  patient.save(function(err, savedPatient) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Patient'});
      resourceHistory.addVersion(savedPatient.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/patient/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var patient = req.patient;
  patient = _.extend(patient, req.body);
  patient.save(function(err, savedpatient) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedpatient);
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
  var patient = req.patient;
  patient.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Patient",
    id: "http://localhost:3000/patient",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/patient",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Patient"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, patient) {
          var entrywrapper = {
            title: "Patient " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/patient/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/patient/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: patient
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no patient found');
      res.send(500);
    }
  });
};