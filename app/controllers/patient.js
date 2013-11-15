var mongoose = require('mongoose');
var _ = require('underscore');
var Patient = mongoose.model('Patient');
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
      Patient.findOne(lookUpId, function(modelErr, patient) {
        if (modelErr) {
          return next(modelErr);
        }
        if(patient !== null) {
          req.patient = patient;
          return next();
        }
        else {
          return next(new Error('Patient not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var patient = req.patient;
  var locals = {patient: patient};
  res.format(ResponseFormatHelper.buildFormatHash('patient', locals, res));
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