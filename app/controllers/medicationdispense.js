var mongoose = require('mongoose');
var _ = require('underscore');
var MedicationDispense = mongoose.model('MedicationDispense');
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
      MedicationDispense.findOne(lookUpId, function(modelErr, medicationdispense) {
        if (modelErr) {
          return next(modelErr);
        }
        if(medicationdispense !== null) {
          req.medicationdispense = medicationdispense;
          return next();
        }
        else {
          return next(new Error('MedicationDispense not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var medicationdispense = req.medicationdispense;
  var locals = {medicationdispense: medicationdispense};
  res.format(ResponseFormatHelper.buildFormatHash('medicationdispense', locals, res));
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