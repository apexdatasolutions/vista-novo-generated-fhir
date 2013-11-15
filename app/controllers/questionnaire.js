var mongoose = require('mongoose');
var _ = require('underscore');
var Questionnaire = mongoose.model('Questionnaire');
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
      Questionnaire.findOne(lookUpId, function(modelErr, questionnaire) {
        if (modelErr) {
          return next(modelErr);
        }
        if(questionnaire !== null) {
          req.questionnaire = questionnaire;
          return next();
        }
        else {
          return next(new Error('Questionnaire not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var questionnaire = req.questionnaire;
  var locals = {questionnaire: questionnaire};
  res.format(ResponseFormatHelper.buildFormatHash('questionnaire', locals, res));
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