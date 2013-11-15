var mongoose = require('mongoose');
var _ = require('underscore');
var Medication = mongoose.model('Medication');
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
      Medication.findOne(lookUpId, function(modelErr, medication) {
        if (modelErr) {
          return next(modelErr);
        }
        if(medication !== null) {
          req.medication = medication;
          return next();
        }
        else {
          return next(new Error('Medication not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var medication = req.medication;
  var locals = {medication: medication};
  res.format(ResponseFormatHelper.buildFormatHash('medication', locals, res));
};

exports.create = function(req, res) {
  var medication = new Medication(req.body);
  medication.save(function(err, savedMedication) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Medication'});
      resourceHistory.addVersion(savedMedication.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/medication/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var medication = req.medication;
  medication = _.extend(medication, req.body);
  medication.save(function(err, savedmedication) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedication);
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
  var medication = req.medication;
  medication.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};