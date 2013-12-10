var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var RelatedPerson = mongoose.model('RelatedPerson');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, relatedperson) {
      req.relatedperson = relatedperson;
      next(relatedperson);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, relatedperson) {
          req.relatedperson = relatedperson;
          next(relatedperson);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var relatedperson = req.relatedperson;
  var json = JSON.stringify(relatedperson);
  res.send(json);
};

exports.create = function(req, res) {
  var relatedperson = new RelatedPerson(req.body);
  relatedperson.save(function(err, savedRelatedPerson) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'RelatedPerson'});
      resourceHistory.addVersion(savedRelatedPerson.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/relatedperson/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var relatedperson = req.relatedperson;
  relatedperson = _.extend(relatedperson, req.body);
  relatedperson.save(function(err, savedrelatedperson) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedrelatedperson);
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
  var relatedperson = req.relatedperson;
  relatedperson.remove(function (err) {
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

  ResourceHistory.find({resourceType:"RelatedPerson"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, relatedperson) {
          models.push(relatedperson);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no relatedperson found');
      res.send(500);
    }
  });
};