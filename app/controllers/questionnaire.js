var mongoose = require('mongoose');
var _ = require('underscore');
var fs = require('fs');
var eco = require('eco');
var async = require('async');
var Questionnaire = mongoose.model('Questionnaire');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
  if (req.resourceHistory) {
    req.resourceHistory.findLatest(function(err, questionnaire) {
      req.questionnaire = questionnaire;
      next(questionnaire);
    });
  } else {
    ResourceHistory.findOne(id, function(rhErr, resourceHistory) {
      if (rhErr) {
        next(rhErr);
      }
      if(resourceHistory !== null) {
        req.resourceHistory = resourceHistory;
        req.resourceHistory.findLatest(function(err, questionnaire) {
          req.questionnaire = questionnaire;
          next(questionnaire);
        });
      }
    });
  }
};

exports.show = function(req, res) {
  var questionnaire = req.questionnaire;
  var json = JSON.stringify(questionnaire);
  res.send(json);
};

exports.create = function(req, res) {
  var questionnaire = new Questionnaire(req.body);
  questionnaire.save(function(err, savedQuestionnaire) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Questionnaire'});
      resourceHistory.addVersion(savedQuestionnaire.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/questionnaire/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var questionnaire = req.questionnaire;
  questionnaire = _.extend(questionnaire, req.body);
  questionnaire.save(function(err, savedquestionnaire) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedquestionnaire);
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
  var questionnaire = req.questionnaire;
  questionnaire.remove(function (err) {
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

  ResourceHistory.find({resourceType:"Questionnaire"}, function (rhErr, histories) {
    if (rhErr) {
      return next(rhErr);
    }
    if (histories !== null) {
      async.forEach(histories, function(history, callback) {
        history.findLatest( function(err, questionnaire) {
          models.push(questionnaire);
          callback();
        });
      }, function(err) {
          console.log(models);
          res.send(eco.render(template, models));
      });
    } else {
      console.log('no questionnaire found');
      res.send(500);
    }
  });
};