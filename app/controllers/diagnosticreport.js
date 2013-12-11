var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var DiagnosticReport = mongoose.model('DiagnosticReport');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, diagnosticreport) {
        req.diagnosticreport = diagnosticreport;
        next(diagnosticreport);
      });
    } else {
      req.resourceHistory.findLatest(function(err, diagnosticreport) {
        req.diagnosticreport = diagnosticreport;
        next(diagnosticreport);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, diagnosticreport) {
          req.diagnosticreport = diagnosticreport;
          next(diagnosticreport);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var diagnosticreport = req.diagnosticreport;
  var json = JSON.stringify(diagnosticreport);
  res.send(json);
};

exports.create = function(req, res) {
  var diagnosticreport = new DiagnosticReport(req.body);
  diagnosticreport.save(function(err, savedDiagnosticReport) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DiagnosticReport'});
      resourceHistory.addVersion(savedDiagnosticReport.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/diagnosticreport/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var diagnosticreport = req.diagnosticreport;
  diagnosticreport = _.extend(diagnosticreport, req.body);
  diagnosticreport.save(function(err, saveddiagnosticreport) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddiagnosticreport);
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
  var diagnosticreport = req.diagnosticreport;
  diagnosticreport.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type DiagnosticReport",
    id: "http://localhost:3000/diagnosticreport",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/diagnosticreport",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Patient"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, diagnosticreport) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/diagnosticreport/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/diagnosticreport/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: diagnosticreport
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no diagnosticreport found');
      res.send(500);
    }
  });
};