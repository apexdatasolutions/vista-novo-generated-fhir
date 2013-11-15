var mongoose = require('mongoose');
var _ = require('underscore');
var Specimen = mongoose.model('Specimen');
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
      Specimen.findOne(lookUpId, function(modelErr, specimen) {
        if (modelErr) {
          return next(modelErr);
        }
        if(specimen !== null) {
          req.specimen = specimen;
          return next();
        }
        else {
          return next(new Error('Specimen not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var specimen = req.specimen;
  var locals = {specimen: specimen};
  res.format(ResponseFormatHelper.buildFormatHash('specimen', locals, res));
};

exports.create = function(req, res) {
  var specimen = new Specimen(req.body);
  specimen.save(function(err, savedSpecimen) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Specimen'});
      resourceHistory.addVersion(savedSpecimen.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/specimen/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var specimen = req.specimen;
  specimen = _.extend(specimen, req.body);
  specimen.save(function(err, savedspecimen) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedspecimen);
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
  var specimen = req.specimen;
  specimen.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};