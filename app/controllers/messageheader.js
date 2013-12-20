var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var MessageHeader = mongoose.model('MessageHeader');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, messageheader) {
        req.messageheader = messageheader;
        next(messageheader);
      });
    } else {
      req.resourceHistory.findLatest(function(err, messageheader) {
        req.messageheader = messageheader;
        next(messageheader);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, messageheader) {
          req.messageheader = messageheader;
          next(messageheader);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var messageheader = req.messageheader;
  var json = JSON.stringify(messageheader);
  res.send(json);
};

exports.create = function(req, res) {
  var messageheader = new MessageHeader(req.body);
  messageheader.save(function(err, savedMessageHeader) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'MessageHeader'});
      resourceHistory.addVersion(savedMessageHeader.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/messageheader/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var messageheader = req.messageheader;
  messageheader = _.extend(messageheader, req.body);
  messageheader.save(function(err, savedmessageheader) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmessageheader);
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
  var messageheader = req.messageheader;
  messageheader.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type MessageHeader",
    id: "http://localhost:3000/messageheader",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/messageheader",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"MessageHeader"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    var counter = 0;
    async.forEach(histories, function(history, callback) {
      counter++;
      content.totalResults = counter;
      history.findLatest( function(err, messageheader) {
        var entrywrapper = {
          title: "MessageHeader " + history.vistaId + " Version " + history.versionCount(),
          id: "http://localhost:3000/messageheader/@" + history.vistaId,
          link: {
            href: "http://localhost:3000/messageheader/@" + history.vistaId + "/history/@" + history.versionCount(),
            rel: "self"
          },
          updated: history.lastUpdatedAt(),
          published: new Date(Date.now()),
          content: messageheader
        };
        content.entry.push(entrywrapper);
        callback();
      });
    }, function(err) {
        res.send(JSON.stringify(content));
    });
  });
};