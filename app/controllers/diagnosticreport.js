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
    req.resourceHistory.findLatest(function(err, diagnosticreport) {
      req.diagnosticreport = diagnosticreport;
      next(diagnosticreport);
    });
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
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"DiagnosticReport"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, diagnosticreport) {
          models.push(diagnosticreport);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no diagnosticreport found');
      res.send(500);
    }
  });
};