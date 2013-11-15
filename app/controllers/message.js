var mongoose = require('mongoose');
var _ = require('underscore');
var Message = mongoose.model('Message');
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
      Message.findOne(lookUpId, function(modelErr, message) {
        if (modelErr) {
          return next(modelErr);
        }
        if(message !== null) {
          req.message = message;
          return next();
        }
        else {
          return next(new Error('Message not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var message = req.message;
  var locals = {message: message};
  res.format(ResponseFormatHelper.buildFormatHash('message', locals, res));
};

exports.create = function(req, res) {
  var message = new Message(req.body);
  message.save(function(err, savedMessage) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Message'});
      resourceHistory.addVersion(savedMessage.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/message/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var message = req.message;
  message = _.extend(message, req.body);
  message.save(function(err, savedmessage) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmessage);
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
  var message = req.message;
  message.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};