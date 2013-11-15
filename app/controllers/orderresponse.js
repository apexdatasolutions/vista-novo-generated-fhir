var mongoose = require('mongoose');
var _ = require('underscore');
var OrderResponse = mongoose.model('OrderResponse');
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
      OrderResponse.findOne(lookUpId, function(modelErr, orderresponse) {
        if (modelErr) {
          return next(modelErr);
        }
        if(orderresponse !== null) {
          req.orderresponse = orderresponse;
          return next();
        }
        else {
          return next(new Error('OrderResponse not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var orderresponse = req.orderresponse;
  var locals = {orderresponse: orderresponse};
  res.format(ResponseFormatHelper.buildFormatHash('orderresponse', locals, res));
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