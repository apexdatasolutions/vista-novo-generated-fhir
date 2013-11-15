var mongoose = require('mongoose');
var _ = require('underscore');
var Group = mongoose.model('Group');
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
      Group.findOne(lookUpId, function(modelErr, group) {
        if (modelErr) {
          return next(modelErr);
        }
        if(group !== null) {
          req.group = group;
          return next();
        }
        else {
          return next(new Error('Group not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var group = req.group;
  var locals = {group: group};
  res.format(ResponseFormatHelper.buildFormatHash('group', locals, res));
};

exports.create = function(req, res) {
  var group = new Group(req.body);
  group.save(function(err, savedGroup) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Group'});
      resourceHistory.addVersion(savedGroup.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/group/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var group = req.group;
  group = _.extend(group, req.body);
  group.save(function(err, savedgroup) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedgroup);
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
  var group = req.group;
  group.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};