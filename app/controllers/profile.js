var mongoose = require('mongoose');
var _ = require('underscore');
var Profile = mongoose.model('Profile');
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
      Profile.findOne(lookUpId, function(modelErr, profile) {
        if (modelErr) {
          return next(modelErr);
        }
        if(profile !== null) {
          req.profile = profile;
          return next();
        }
        else {
          return next(new Error('Profile not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var profile = req.profile;
  var locals = {profile: profile};
  res.format(ResponseFormatHelper.buildFormatHash('profile', locals, res));
};

exports.create = function(req, res) {
  var profile = new Profile(req.body);
  profile.save(function(err, savedProfile) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Profile'});
      resourceHistory.addVersion(savedProfile.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/profile/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var profile = req.profile;
  profile = _.extend(profile, req.body);
  profile.save(function(err, savedprofile) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedprofile);
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
  var profile = req.profile;
  profile.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};