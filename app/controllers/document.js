var mongoose = require('mongoose');
var _ = require('underscore');
var Document = mongoose.model('Document');
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
      Document.findOne(lookUpId, function(modelErr, document) {
        if (modelErr) {
          return next(modelErr);
        }
        if(document !== null) {
          req.document = document;
          return next();
        }
        else {
          return next(new Error('Document not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var document = req.document;
  var locals = {document: document};
  res.format(ResponseFormatHelper.buildFormatHash('document', locals, res));
};

exports.create = function(req, res) {
  var document = new Document(req.body);
  document.save(function(err, savedDocument) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Document'});
      resourceHistory.addVersion(savedDocument.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/document/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var document = req.document;
  document = _.extend(document, req.body);
  document.save(function(err, saveddocument) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(saveddocument);
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
  var document = req.document;
  document.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};