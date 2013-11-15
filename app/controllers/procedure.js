var mongoose = require('mongoose');
var _ = require('underscore');
var Procedure = mongoose.model('Procedure');
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
      Procedure.findOne(lookUpId, function(modelErr, procedure) {
        if (modelErr) {
          return next(modelErr);
        }
        if(procedure !== null) {
          req.procedure = procedure;
          return next();
        }
        else {
          return next(new Error('Procedure not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var procedure = req.procedure;
  var locals = {procedure: procedure};
  res.format(ResponseFormatHelper.buildFormatHash('procedure', locals, res));
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