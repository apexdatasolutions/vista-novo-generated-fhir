var mongoose = require('mongoose');
var _ = require('underscore');
var DiagnosticReport = mongoose.model('DiagnosticReport');
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
      DiagnosticReport.findOne(lookUpId, function(modelErr, diagnosticreport) {
        if (modelErr) {
          return next(modelErr);
        }
        if(diagnosticreport !== null) {
          req.diagnosticreport = diagnosticreport;
          return next();
        }
        else {
          return next(new Error('DiagnosticReport not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var diagnosticreport = req.diagnosticreport;
  var locals = {diagnosticreport: diagnosticreport};
  res.format(ResponseFormatHelper.buildFormatHash('diagnosticreport', locals, res));
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