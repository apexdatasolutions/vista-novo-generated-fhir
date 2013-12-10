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
    req.resourceHistory.findLatest(function(err, medicationprescription) {
      req.medicationprescription = medicationprescription;
      next(medicationprescription);
    });
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
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"MedicationPrescription"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, medicationprescription) {
          models.push(medicationprescription);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no medicationprescription found');
      res.send(500);
    }
  });
};