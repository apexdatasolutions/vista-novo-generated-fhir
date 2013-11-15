var mongoose = require('mongoose');
var _ = require('underscore');
var DocumentManifest = mongoose.model('DocumentManifest');
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
      DocumentManifest.findOne(lookUpId, function(modelErr, documentmanifest) {
        if (modelErr) {
          return next(modelErr);
        }
        if(documentmanifest !== null) {
          req.documentmanifest = documentmanifest;
          return next();
        }
        else {
          return next(new Error('DocumentManifest not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var documentmanifest = req.documentmanifest;
  var locals = {documentmanifest: documentmanifest};
  res.format(ResponseFormatHelper.buildFormatHash('documentmanifest', locals, res));
};

exports.create = function(req, res) {
  var documentmanifest = new DocumentManifest(req.body);
  documentmanifest.save(function(err, savedDocumentManifest) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'DocumentManifest'});
      resourceHistory.addVersion(savedDocumentManifest.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/documentmanifest/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var documentmanifest = req.documentmanifest;
  documentmanifest = _.extend(documentmanifest, req.body);
  documentmanifest.save(function(err, saveddocumentmanifest) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddocumentmanifest);
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
  var documentmanifest = req.documentmanifest;
  documentmanifest.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};