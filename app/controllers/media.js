var mongoose = require('mongoose');
var _ = require('underscore');
var Media = mongoose.model('Media');
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
      Media.findOne(lookUpId, function(modelErr, media) {
        if (modelErr) {
          return next(modelErr);
        }
        if(media !== null) {
          req.media = media;
          return next();
        }
        else {
          return next(new Error('Media not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var media = req.media;
  var locals = {media: media};
  res.format(ResponseFormatHelper.buildFormatHash('media', locals, res));
};

exports.create = function(req, res) {
  var media = new Media(req.body);
  media.save(function(err, savedMedia) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Media'});
      resourceHistory.addVersion(savedMedia.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/media/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var media = req.media;
  media = _.extend(media, req.body);
  media.save(function(err, savedmedia) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedmedia);
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
  var media = req.media;
  media.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};