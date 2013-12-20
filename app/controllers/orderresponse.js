var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var OrderResponse = mongoose.model('OrderResponse');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, orderresponse) {
        req.orderresponse = orderresponse;
        next(orderresponse);
      });
    } else {
      req.resourceHistory.findLatest(function(err, orderresponse) {
        req.orderresponse = orderresponse;
        next(orderresponse);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, orderresponse) {
          req.orderresponse = orderresponse;
          next(orderresponse);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var orderresponse = req.orderresponse;
  var json = JSON.stringify(orderresponse);
  res.send(json);
};

exports.create = function(req, res) {
  var orderresponse = new OrderResponse(req.body);
  orderresponse.save(function(err, savedOrderResponse) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'OrderResponse'});
      resourceHistory.addVersion(savedOrderResponse.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/orderresponse/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var orderresponse = req.orderresponse;
  orderresponse = _.extend(orderresponse, req.body);
  orderresponse.save(function(err, savedorderresponse) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedorderresponse);
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
  var orderresponse = req.orderresponse;
  orderresponse.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type OrderResponse",
    id: "http://localhost:3000/orderresponse",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/orderresponse",
      rel: "self"
    },
    updated: new Date(Date.now()),
    entry: []
  };

  ResourceHistory.find({resourceType:"OrderResponse"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
      var counter = 0;
      async.forEach(histories, function(history, callback) {
        counter++;
        content.totalResults = counter;
        history.findLatest( function(err, orderresponse) {
          var entrywrapper = {
            title: "OrderResponse " + history.vistaId + " Version " + history.versionCount(),
            id: "http://localhost:3000/orderresponse/@" + history.vistaId,
            link: {
              href: "http://localhost:3000/orderresponse/@" + history.vistaId + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: orderresponse
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no orderresponse found');
      res.send(500);
    }
  });
};