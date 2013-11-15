var mongoose = require('mongoose');
var _ = require('underscore');
var Order = mongoose.model('Order');
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
      Order.findOne(lookUpId, function(modelErr, order) {
        if (modelErr) {
          return next(modelErr);
        }
        if(order !== null) {
          req.order = order;
          return next();
        }
        else {
          return next(new Error('Order not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var order = req.order;
  var locals = {order: order};
  res.format(ResponseFormatHelper.buildFormatHash('order', locals, res));
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