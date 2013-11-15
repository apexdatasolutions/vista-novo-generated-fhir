var mongoose = require('mongoose');
var _ = require('underscore');
var DiagnosticOrder = mongoose.model('DiagnosticOrder');
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
      DiagnosticOrder.findOne(lookUpId, function(modelErr, diagnosticorder) {
        if (modelErr) {
          return next(modelErr);
        }
        if(diagnosticorder !== null) {
          req.diagnosticorder = diagnosticorder;
          return next();
        }
        else {
          return next(new Error('DiagnosticOrder not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var diagnosticorder = req.diagnosticorder;
  var locals = {diagnosticorder: diagnosticorder};
  res.format(ResponseFormatHelper.buildFormatHash('diagnosticorder', locals, res));
};

exports.create = function(req, res) {
  var diagnosticorder = new DiagnosticOrder(req.body);
  diagnosticorder.save(function(err, savedDiagnosticOrder) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DiagnosticOrder'});
      resourceHistory.addVersion(savedDiagnosticOrder.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/diagnosticorder/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var diagnosticorder = req.diagnosticorder;
  diagnosticorder = _.extend(diagnosticorder, req.body);
  diagnosticorder.save(function(err, saveddiagnosticorder) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddiagnosticorder);
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
  var diagnosticorder = req.diagnosticorder;
  diagnosticorder.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};