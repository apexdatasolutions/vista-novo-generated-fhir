var mongoose = require('mongoose');
var _ = require('underscore');
var AdverseReaction = mongoose.model('AdverseReaction');
var ResourceHistory = mongoose.model('ResourceHistory');
var ResponseFormatHelper = require(__dirname + '/../../lib/response_format_helper');

exports.load = function(req, res, id, vid, next) {
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
      AdverseReaction.findOne(lookUpId, function(modelErr, adversereaction) {
        if (modelErr) {
          return next(modelErr);
        }
        if(adversereaction !== null) {
          req.adversereaction = adversereaction;
          return next(adversereaction);
        }
        else {
          return next(new Error('AdverseReaction not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.list = function(req, res) {
  var query = AdverseReaction.find();
  query.find(function(error,results){
    res.render('adversereaction/index', {
      records: results
    });
  });
};

exports.show = function(req, res) {
  var adversereaction = req.adversereaction;
  var locals = {adversereaction: adversereaction};
  res.format(ResponseFormatHelper.buildFormatHash('adversereaction', locals, res));
};

exports.create = function(req, res) {
  var adversereaction = new AdverseReaction(req.body);
  adversereaction.save(function(err, savedAdverseReaction) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'AdverseReaction'});
      resourceHistory.addVersion(savedAdverseReaction.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/adversereaction/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var adversereaction = req.adversereaction;
  adversereaction = _.extend(adversereaction, req.body);
  adversereaction.save(function(err, savedadversereaction) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedadversereaction);
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
  var adversereaction = req.adversereaction;
  adversereaction.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};