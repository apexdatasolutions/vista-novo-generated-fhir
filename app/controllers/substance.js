var mongoose = require('mongoose');
var _ = require('underscore');
var Substance = mongoose.model('Substance');
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
      Substance.findOne(lookUpId, function(modelErr, substance) {
        if (modelErr) {
          return next(modelErr);
        }
        if(substance !== null) {
          req.substance = substance;
          return next();
        }
        else {
          return next(new Error('Substance not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var substance = req.substance;
  var locals = {substance: substance};
  res.format(ResponseFormatHelper.buildFormatHash('substance', locals, res));
};

exports.create = function(req, res) {
  var substance = new Substance(req.body);
  substance.save(function(err, savedSubstance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Substance'});
      resourceHistory.addVersion(savedSubstance.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/substance/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var substance = req.substance;
  substance = _.extend(substance, req.body);
  substance.save(function(err, savedsubstance) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedsubstance);
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
  var substance = req.substance;
  substance.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};