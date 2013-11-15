var mongoose = require('mongoose');
var _ = require('underscore');
var MedicationPrescription = mongoose.model('MedicationPrescription');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, next, id, vid) {
  ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
    if (rhErr) {
      return next(rhErr);
    }
    if(resourceHistory !== null) {
      req.resourceHistory = resourceHistory;
      var lookUpId = null;
      if (vid !== null) {
        lookUpId = vid;
      } else {
        lookUpId = resourceHistory.latestVersionId();
      }
      MedicationPrescription.findOne(lookUpId, function(modelErr, medicationprescription) {
        if (modelErr) {
          return next(modelErr);
        }
        if(medicationprescription !== null) {
          req.medicationprescription = medicationprescription;
          return next();
        }
        else {
          return next(new Error('MedicationPrescription not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var medicationprescription = req.medicationprescription;
  var locals = {medicationprescription: medicationprescription};
  res.format(ResponseFormatHelper.buildFormatHash('medicationprescription', locals, res));
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