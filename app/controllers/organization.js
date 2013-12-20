var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Organization = mongoose.model('Organization');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, organization) {
        req.organization = organization;
        next(organization);
      });
    } else {
      req.resourceHistory.findLatest(function(err, organization) {
        req.organization = organization;
        next(organization);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, organization) {
          req.organization = organization;
          next(organization);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var organization = req.organization;
  var json = JSON.stringify(organization);
  res.send(json);
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

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Organization",
    id: "http://localhost:3000/organization",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/organization",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Organization"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, organization) {
          var entrywrapper = {
            title: "Organization " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/organization/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/organization/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: organization
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no organization found');
      res.send(500);
    }
  });
};