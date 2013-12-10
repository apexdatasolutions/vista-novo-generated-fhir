var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var ImagingStudy = mongoose.model('ImagingStudy');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, imagingstudy) {
      req.imagingstudy = imagingstudy;
      next(imagingstudy);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, imagingstudy) {
          req.imagingstudy = imagingstudy;
          next(imagingstudy);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var imagingstudy = req.imagingstudy;
  var json = JSON.stringify(imagingstudy);
  res.send(json);
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

exports.list = function(req, res) {
  var models = [];
  var template = fs.readFileSync(__dirname + "/../views/atom.xml.eco", "utf-8");

  ResourceHistory.find({resourceType:"ImagingStudy"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, imagingstudy) {
          models.push(imagingstudy);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no imagingstudy found');
      res.send(500);
    }
  });
};