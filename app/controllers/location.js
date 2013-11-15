var mongoose = require('mongoose');
var _ = require('underscore');
var Location = mongoose.model('Location');
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
      Location.findOne(lookUpId, function(modelErr, location) {
        if (modelErr) {
          return next(modelErr);
        }
        if(location !== null) {
          req.location = location;
          return next();
        }
        else {
          return next(new Error('Location not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var location = req.location;
  var locals = {location: location};
  res.format(ResponseFormatHelper.buildFormatHash('location', locals, res));
};

exports.create = function(req, res) {
  var location = new Location(req.body);
  location.save(function(err, savedLocation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Location'});
      resourceHistory.addVersion(savedLocation.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/location/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var location = req.location;
  location = _.extend(location, req.body);
  location.save(function(err, savedlocation) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedlocation);
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
  var location = req.location;
  location.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};