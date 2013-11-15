var mongoose = require('mongoose');
var _ = require('underscore');
var SecurityEvent = mongoose.model('SecurityEvent');
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
      SecurityEvent.findOne(lookUpId, function(modelErr, securityevent) {
        if (modelErr) {
          return next(modelErr);
        }
        if(securityevent !== null) {
          req.securityevent = securityevent;
          return next();
        }
        else {
          return next(new Error('SecurityEvent not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var securityevent = req.securityevent;
  var locals = {securityevent: securityevent};
  res.format(ResponseFormatHelper.buildFormatHash('securityevent', locals, res));
};

exports.create = function(req, res) {
  var securityevent = new SecurityEvent(req.body);
  securityevent.save(function(err, savedSecurityEvent) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'SecurityEvent'});
      resourceHistory.addVersion(savedSecurityEvent.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/securityevent/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var securityevent = req.securityevent;
  securityevent = _.extend(securityevent, req.body);
  securityevent.save(function(err, savedsecurityevent) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedsecurityevent);
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
  var securityevent = req.securityevent;
  securityevent.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};