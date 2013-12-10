var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var FamilyHistory = mongoose.model('FamilyHistory');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, familyhistory) {
      req.familyhistory = familyhistory;
      next(familyhistory);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, familyhistory) {
          req.familyhistory = familyhistory;
          next(familyhistory);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var familyhistory = req.familyhistory;
  var json = JSON.stringify(familyhistory);
  res.send(json);
};

exports.create = function(req, res) {
  var familyhistory = new FamilyHistory(req.body);
  familyhistory.save(function(err, savedFamilyHistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'FamilyHistory'});
      resourceHistory.addVersion(savedFamilyHistory.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/familyhistory/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var familyhistory = req.familyhistory;
  familyhistory = _.extend(familyhistory, req.body);
  familyhistory.save(function(err, savedfamilyhistory) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedfamilyhistory);
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
  var familyhistory = req.familyhistory;
  familyhistory.remove(function (err) {
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

  ResourceHistory.find({resourceType:"FamilyHistory"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, familyhistory) {
          models.push(familyhistory);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no familyhistory found');
      res.send(500);
    }
  });
};