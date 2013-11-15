var mongoose = require('mongoose');
var _ = require('underscore');
var ValueSet = mongoose.model('ValueSet');
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
      ValueSet.findOne(lookUpId, function(modelErr, valueset) {
        if (modelErr) {
          return next(modelErr);
        }
        if(valueset !== null) {
          req.valueset = valueset;
          return next();
        }
        else {
          return next(new Error('ValueSet not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var valueset = req.valueset;
  var locals = {valueset: valueset};
  res.format(ResponseFormatHelper.buildFormatHash('valueset', locals, res));
};

exports.create = function(req, res) {
  var valueset = new ValueSet(req.body);
  valueset.save(function(err, savedValueSet) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ValueSet'});
      resourceHistory.addVersion(savedValueSet.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/valueset/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var valueset = req.valueset;
  valueset = _.extend(valueset, req.body);
  valueset.save(function(err, savedvalueset) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedvalueset);
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
  var valueset = req.valueset;
  valueset.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};