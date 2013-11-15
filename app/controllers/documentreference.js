var mongoose = require('mongoose');
var _ = require('underscore');
var DocumentReference = mongoose.model('DocumentReference');
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
      DocumentReference.findOne(lookUpId, function(modelErr, documentreference) {
        if (modelErr) {
          return next(modelErr);
        }
        if(documentreference !== null) {
          req.documentreference = documentreference;
          return next();
        }
        else {
          return next(new Error('DocumentReference not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var documentreference = req.documentreference;
  var locals = {documentreference: documentreference};
  res.format(ResponseFormatHelper.buildFormatHash('documentreference', locals, res));
};

exports.create = function(req, res) {
  var documentreference = new DocumentReference(req.body);
  documentreference.save(function(err, savedDocumentReference) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DocumentReference'});
      resourceHistory.addVersion(savedDocumentReference.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/documentreference/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var documentreference = req.documentreference;
  documentreference = _.extend(documentreference, req.body);
  documentreference.save(function(err, saveddocumentreference) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddocumentreference);
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
  var documentreference = req.documentreference;
  documentreference.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};