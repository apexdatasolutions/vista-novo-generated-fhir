var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var OperationOutcome = mongoose.model('OperationOutcome');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, operationoutcome) {
        req.operationoutcome = operationoutcome;
        next(operationoutcome);
      });
    } else {
      req.resourceHistory.findLatest(function(err, operationoutcome) {
        req.operationoutcome = operationoutcome;
        next(operationoutcome);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, operationoutcome) {
          req.operationoutcome = operationoutcome;
          next(operationoutcome);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var operationoutcome = req.operationoutcome;
  var json = JSON.stringify(operationoutcome);
  res.send(json);
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

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type OperationOutcome",
    id: "http://localhost:3000/operationoutcome",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/operationoutcome",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"Patient"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, operationoutcome) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/operationoutcome/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/operationoutcome/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: operationoutcome
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no operationoutcome found');
      res.send(500);
    }
  });
};