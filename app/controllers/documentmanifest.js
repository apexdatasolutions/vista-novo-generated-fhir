var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var DocumentManifest = mongoose.model('DocumentManifest');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, documentmanifest) {
      req.documentmanifest = documentmanifest;
      next(documentmanifest);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, documentmanifest) {
          req.documentmanifest = documentmanifest;
          next(documentmanifest);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var documentmanifest = req.documentmanifest;
  var json = JSON.stringify(documentmanifest);
  res.send(json);
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

exports.list = function(req, res) {
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"DocumentManifest"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, documentmanifest) {
          models.push(documentmanifest);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no documentmanifest found');
      res.send(500);
    }
  });
};