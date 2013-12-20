var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Specimen = mongoose.model('Specimen');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, specimen) {
        req.specimen = specimen;
        next(specimen);
      });
    } else {
      req.resourceHistory.findLatest(function(err, specimen) {
        req.specimen = specimen;
        next(specimen);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, specimen) {
          req.specimen = specimen;
          next(specimen);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var specimen = req.specimen;
  var json = JSON.stringify(specimen);
  res.send(json);
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

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Specimen",
    id: "http://localhost:3000/specimen",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/specimen",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Specimen"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, specimen) {
          var entrywrapper = {
            title: "Specimen " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/specimen/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/specimen/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: specimen
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no specimen found');
      res.send(500);
    }
  });
};