var mongoose = require('mongoose');
var _ = require('underscore');
var ConceptMap = mongoose.model('ConceptMap');
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
      ConceptMap.findOne(lookUpId, function(modelErr, conceptmap) {
        if (modelErr) {
          return next(modelErr);
        }
        if(conceptmap !== null) {
          req.conceptmap = conceptmap;
          return next();
        }
        else {
          return next(new Error('ConceptMap not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var conceptmap = req.conceptmap;
  var locals = {conceptmap: conceptmap};
  res.format(ResponseFormatHelper.buildFormatHash('conceptmap', locals, res));
};

exports.create = function(req, res) {
  var conceptmap = new ConceptMap(req.body);
  conceptmap.save(function(err, savedConceptMap) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ConceptMap'});
      resourceHistory.addVersion(savedConceptMap.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/conceptmap/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var conceptmap = req.conceptmap;
  conceptmap = _.extend(conceptmap, req.body);
  conceptmap.save(function(err, savedconceptmap) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedconceptmap);
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
  var conceptmap = req.conceptmap;
  conceptmap.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};