var mongoose = require('mongoose');
var _ = require('underscore');
var Supply = mongoose.model('Supply');
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
      Supply.findOne(lookUpId, function(modelErr, supply) {
        if (modelErr) {
          return next(modelErr);
        }
        if(supply !== null) {
          req.supply = supply;
          return next();
        }
        else {
          return next(new Error('Supply not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var supply = req.supply;
  var locals = {supply: supply};
  res.format(ResponseFormatHelper.buildFormatHash('supply', locals, res));
};

exports.create = function(req, res) {
  var supply = new Supply(req.body);
  supply.save(function(err, savedSupply) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Supply'});
      resourceHistory.addVersion(savedSupply.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/supply/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var supply = req.supply;
  supply = _.extend(supply, req.body);
  supply.save(function(err, savedsupply) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedsupply);
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
  var supply = req.supply;
  supply.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};