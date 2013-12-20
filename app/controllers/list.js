var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var List = mongoose.model('List');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, list) {
        req.list = list;
        next(list);
      });
    } else {
      req.resourceHistory.findLatest(function(err, list) {
        req.list = list;
        next(list);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, list) {
          req.list = list;
          next(list);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var list = req.list;
  var json = JSON.stringify(list);
  res.send(json);
};

exports.create = function(req, res) {
  var list = new List(req.body);
  list.save(function(err, savedList) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'List'});
      resourceHistory.addVersion(savedList.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/list/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var list = req.list;
  list = _.extend(list, req.body);
  list.save(function(err, savedlist) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedlist);
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
  var list = req.list;
  list.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type List",
    id: "http://localhost:3000/list",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/list",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"List"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, list) {
          var entrywrapper = {
            title: "List " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/list/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/list/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: list
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no list found');
      res.send(500);
    }
  });
};