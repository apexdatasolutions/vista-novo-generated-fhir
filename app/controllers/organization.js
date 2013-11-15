var mongoose = require('mongoose');
var _ = require('underscore');
var Organization = mongoose.model('Organization');
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
      Organization.findOne(lookUpId, function(modelErr, organization) {
        if (modelErr) {
          return next(modelErr);
        }
        if(organization !== null) {
          req.organization = organization;
          return next();
        }
        else {
          return next(new Error('Organization not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var organization = req.organization;
  var locals = {organization: organization};
  res.format(ResponseFormatHelper.buildFormatHash('organization', locals, res));
};

exports.create = function(req, res) {
  var organization = new Organization(req.body);
  organization.save(function(err, savedOrganization) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Organization'});
      resourceHistory.addVersion(savedOrganization.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/organization/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var organization = req.organization;
  organization = _.extend(organization, req.body);
  organization.save(function(err, savedorganization) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedorganization);
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
  var organization = req.organization;
  organization.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};