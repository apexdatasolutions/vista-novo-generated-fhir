var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Order = mongoose.model('Order');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    if(vid !== null){
      req.resourceHistory.getVersion(vid, function(err, order) {
        req.order = order;
        next(order);
      });
    } else {
      req.resourceHistory.findLatest(function(err, order) {
        req.order = order;
        next(order);
      });
    }
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, order) {
          req.order = order;
          next(order);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var order = req.order;
  var json = JSON.stringify(order);
  res.send(json);
};

exports.create = function(req, res) {
  var order = new Order(req.body);
  order.save(function(err, savedOrder) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Order'});
      resourceHistory.addVersion(savedOrder.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/order/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var order = req.order;
  order = _.extend(order, req.body);
  order.save(function(err, savedorder) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedorder);
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
  var order = req.order;
  order.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};

exports.list = function(req, res) {

  var content = {
    title: "Search results for resource type Order",
    id: "http://localhost:3000/order",
    totalResults: 0,
    link: {
      href: "http://localhost:3000/order",
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
        history.findLatest( function(err, order) {
          var entrywrapper = {
            title: "Patient " + history.latestVersionId() + " Version " + history.versionCount(),
            id: "http://localhost:3000/order/@" + history.latestVersionId(),
            link: {
              href: "http://localhost:3000/order/@" + history.latestVersionId() + "/history/@" + history.versionCount(),
              rel: "self"
            },
            updated: history.lastUpdatedAt(),
            published: new Date(Date.now()),
            content: order
          };
          content.entry.push(entrywrapper);
          callback();
        });
      }, function(err) {
          res.send(JSON.stringify(content));
      });
    } else {
      console.log('no order found');
      res.send(500);
    }
  });
};