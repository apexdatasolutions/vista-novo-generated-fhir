var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var DocumentReference = mongoose.model('DocumentReference');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, documentreference) {
        req.documentreference = documentreference;
        next(documentreference);
      });
    } else {
      req.resourceHistory.findLatest(function(err, documentreference) {
        req.documentreference = documentreference;
        next(documentreference);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, documentreference) {
          req.documentreference = documentreference;
          next(documentreference);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var documentreference = req.documentreference;
  var json = JSON.stringify(documentreference);
  res.send(json);
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

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type DocumentReference",
    id: "http://localhost:3000/documentreference",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/documentreference",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"DocumentReference"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, documentreference) {
          var entrywrapper = {
            title: "DocumentReference " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/documentreference/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/documentreference/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: documentreference
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no documentreference found');
      res.send(500);
    }
  });
};