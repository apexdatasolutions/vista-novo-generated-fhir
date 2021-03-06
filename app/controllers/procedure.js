var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Procedure = mongoose.model('Procedure');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, procedure) {
        req.procedure = procedure;
        next(procedure);
      });
    } else {
      req.resourceHistory.findLatest(function(err, procedure) {
        req.procedure = procedure;
        next(procedure);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, procedure) {
          req.procedure = procedure;
          next(procedure);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var procedure = req.procedure;
  var json = JSON.stringify(procedure);
  res.send(json);
};

exports.create = function(req, res) {
  var procedure = new Procedure(req.body);
  procedure.save(function(err, savedProcedure) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Procedure'});
      resourceHistory.addVersion(savedProcedure.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/procedure/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var procedure = req.procedure;
  procedure = _.extend(procedure, req.body);
  procedure.save(function(err, savedprocedure) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedprocedure);
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
  var procedure = req.procedure;
  procedure.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Procedure",
    id: "http://localhost:3000/procedure",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/procedure",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Procedure"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, procedure) {
        var entrywrapper = {
          title: "Procedure " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/procedure/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/procedure/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: procedure
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};