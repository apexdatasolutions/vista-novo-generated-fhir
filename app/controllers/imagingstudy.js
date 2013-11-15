var mongoose = require('mongoose');
var _ = require('underscore');
var ImagingStudy = mongoose.model('ImagingStudy');
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
      ImagingStudy.findOne(lookUpId, function(modelErr, imagingstudy) {
        if (modelErr) {
          return next(modelErr);
        }
        if(imagingstudy !== null) {
          req.imagingstudy = imagingstudy;
          return next();
        }
        else {
          return next(new Error('ImagingStudy not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var imagingstudy = req.imagingstudy;
  var locals = {imagingstudy: imagingstudy};
  res.format(ResponseFormatHelper.buildFormatHash('imagingstudy', locals, res));
};

exports.create = function(req, res) {
  var imagingstudy = new ImagingStudy(req.body);
  imagingstudy.save(function(err, savedImagingStudy) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'ImagingStudy'});
      resourceHistory.addVersion(savedImagingStudy.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/imagingstudy/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var imagingstudy = req.imagingstudy;
  imagingstudy = _.extend(imagingstudy, req.body);
  imagingstudy.save(function(err, savedimagingstudy) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedimagingstudy);
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
  var imagingstudy = req.imagingstudy;
  imagingstudy.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};