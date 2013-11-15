var mongoose = require('mongoose');
var _ = require('underscore');
var MedicationStatement = mongoose.model('MedicationStatement');
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
      MedicationStatement.findOne(lookUpId, function(modelErr, medicationstatement) {
        if (modelErr) {
          return next(modelErr);
        }
        if(medicationstatement !== null) {
          req.medicationstatement = medicationstatement;
          return next();
        }
        else {
          return next(new Error('MedicationStatement not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var medicationstatement = req.medicationstatement;
  var locals = {medicationstatement: medicationstatement};
  res.format(ResponseFormatHelper.buildFormatHash('medicationstatement', locals, res));
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