var mongoose = require('mongoose');
var _ = require('underscore');
var Query = mongoose.model('Query');
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
      Query.findOne(lookUpId, function(modelErr, query) {
        if (modelErr) {
          return next(modelErr);
        }
        if(query !== null) {
          req.query = query;
          return next();
        }
        else {
          return next(new Error('Query not found'));
        }
      });
    }
    else {
      return next(new Error('Could not find any resource history'));
    }        
  });
};

exports.show = function(req, res) {
  var query = req.query;
  var locals = {query: query};
  res.format(ResponseFormatHelper.buildFormatHash('query', locals, res));
};

exports.create = function(req, res) {
  var query = new Query(req.body);
  query.save(function(err, savedQuery) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = new ResourceHistory({resourceType: 'Query'});
      resourceHistory.addVersion(savedQuery.id);
      resourceHistory.save(function(rhErr, savedResourceHistory){
        if (rhErr) {
          res.send(500);
        } else {
          res.set('Location', ("http://localhost:3000/query/@" + resourceHistory.id));
          res.send(201);
        }
      });
    }
  });
};

exports.update = function(req, res) {
  var query = req.query;
  query = _.extend(query, req.body);
  query.save(function(err, savedquery) {
    if(err) {
      res.send(500);
    } else {
      var resourceHistory = req.resourceHistory;
      resourceHistory.addVersion(savedquery);
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
  var query = req.query;
  query.remove(function (err) {
    if(err) {
      res.send(500);
    } else {
      res.send(204);
    }
  });
};