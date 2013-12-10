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
    req.resourceHistory.findLatest(function(err, medicationstatement) {
      req.medicationstatement = medicationstatement;
      next(medicationstatement);
    });
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
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"MedicationStatement"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, medicationstatement) {
          models.push(medicationstatement);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no medicationstatement found');
      res.send(500);
    }
  });
};