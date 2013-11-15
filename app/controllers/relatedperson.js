var mongoose = require('mongoose');
var _ = require('underscore');
var RelatedPerson = mongoose.model('RelatedPerson');
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
      RelatedPerson.findOne(lookUpId, function(modelErr, relatedperson) {
        if (modelErr) {
          return next(modelErr);
        }
        if(relatedperson !== null) {
          req.relatedperson = relatedperson;
          return next();
        }
        else {
          return next(new Error('RelatedPerson not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var relatedperson = req.relatedperson;
  var locals = {relatedperson: relatedperson};
  res.format(ResponseFormatHelper.buildFormatHash('relatedperson', locals, res));
};

exports.create = function(req, res) {
  var relatedperson = new RelatedPerson(req.body);
  relatedperson.save(function(err, savedRelatedPerson) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'RelatedPerson'});
      resourceHistory.addVersion(savedRelatedPerson.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/relatedperson/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var relatedperson = req.relatedperson;
  relatedperson = _.extend(relatedperson, req.body);
  relatedperson.save(function(err, savedrelatedperson) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedrelatedperson);
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
  var relatedperson = req.relatedperson;
  relatedperson.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};