var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var DiagnosticOrder = mongoose.model('DiagnosticOrder');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, diagnosticorder) {
      req.diagnosticorder = diagnosticorder;
      next(diagnosticorder);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, diagnosticorder) {
          req.diagnosticorder = diagnosticorder;
          next(diagnosticorder);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var diagnosticorder = req.diagnosticorder;
  var json = JSON.stringify(diagnosticorder);
  res.send(json);
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

exports.list = function(req, res) {
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"DiagnosticOrder"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, diagnosticorder) {
          models.push(diagnosticorder);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no diagnosticorder found');
      res.send(500);
    }
  });
};