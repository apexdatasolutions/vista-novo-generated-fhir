var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Composition = mongoose.model('Composition');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, composition) {
      req.composition = composition;
      next(composition);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, composition) {
          req.composition = composition;
          next(composition);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var composition = req.composition;
  var json = JSON.stringify(composition);
  res.send(json);
};

exports.create = function(req, res) {
  var composition = new Composition(req.body);
  composition.save(function(err, savedComposition) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Composition'});
      resourceHistory.addVersion(savedComposition.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/composition/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var composition = req.composition;
  composition = _.extend(composition, req.body);
  composition.save(function(err, savedcomposition) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedcomposition);
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
  var composition = req.composition;
  composition.remove(function (err) {
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

  ResourceHistory.find({resourceType:"Composition"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, composition) {
          models.push(composition);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no composition found');
      res.send(500);
    }
  });
};