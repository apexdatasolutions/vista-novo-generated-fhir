var mongoose = require('mongoose');
var _ = require('underscore');
var OperationOutcome = mongoose.model('OperationOutcome');
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
      OperationOutcome.findOne(lookUpId, function(modelErr, operationoutcome) {
        if (modelErr) {
          return next(modelErr);
        }
        if(operationoutcome !== null) {
          req.operationoutcome = operationoutcome;
          return next();
        }
        else {
          return next(new Error('OperationOutcome not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var operationoutcome = req.operationoutcome;
  var locals = {operationoutcome: operationoutcome};
  res.format(ResponseFormatHelper.buildFormatHash('operationoutcome', locals, res));
};

exports.create = function(req, res) {
  var operationoutcome = new OperationOutcome(req.body);
  operationoutcome.save(function(err, savedOperationOutcome) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'OperationOutcome'});
      resourceHistory.addVersion(savedOperationOutcome.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/operationoutcome/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var operationoutcome = req.operationoutcome;
  operationoutcome = _.extend(operationoutcome, req.body);
  operationoutcome.save(function(err, savedoperationoutcome) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedoperationoutcome);
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
  var operationoutcome = req.operationoutcome;
  operationoutcome.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};