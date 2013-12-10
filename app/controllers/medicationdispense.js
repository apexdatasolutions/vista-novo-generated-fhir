var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MedicationDispense = mongoose.model('MedicationDispense');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, medicationdispense) {
      req.medicationdispense = medicationdispense;
      next(medicationdispense);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, medicationdispense) {
          req.medicationdispense = medicationdispense;
          next(medicationdispense);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var medicationdispense = req.medicationdispense;
  var json = JSON.stringify(medicationdispense);
  res.send(json);
};

exports.create = function(req, res) {
  var medicationdispense = new MedicationDispense(req.body);
  medicationdispense.save(function(err, savedMedicationDispense) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'MedicationDispense'});
      resourceHistory.addVersion(savedMedicationDispense.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/medicationdispense/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var medicationdispense = req.medicationdispense;
  medicationdispense = _.extend(medicationdispense, req.body);
  medicationdispense.save(function(err, savedmedicationdispense) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedicationdispense);
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
  var medicationdispense = req.medicationdispense;
  medicationdispense.remove(function (err) {
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

  ResourceHistory.find({resourceType:"MedicationDispense"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, medicationdispense) {
          models.push(medicationdispense);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no medicationdispense found');
      res.send(500);
    }
  });
};