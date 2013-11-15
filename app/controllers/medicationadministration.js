var mongoose = require('mongoose');
var _ = require('underscore');
var MedicationAdministration = mongoose.model('MedicationAdministration');
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
      MedicationAdministration.findOne(lookUpId, function(modelErr, medicationadministration) {
        if (modelErr) {
          return next(modelErr);
        }
        if(medicationadministration !== null) {
          req.medicationadministration = medicationadministration;
          return next();
        }
        else {
          return next(new Error('MedicationAdministration not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var medicationadministration = req.medicationadministration;
  var locals = {medicationadministration: medicationadministration};
  res.format(ResponseFormatHelper.buildFormatHash('medicationadministration', locals, res));
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