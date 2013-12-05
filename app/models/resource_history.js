var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');

var ResourceHistorySchema = new mongoose.Schema({
  resourceType: String,
  vistaId: String,
  history: [{resourceId: mongoose.Schema.Types.ObjectId, createdAt: Date}]
});

ResourceHistorySchema.methods = {
  addVersion: function (resourceId) {
    this.history.push({resourceId: resourceId, createdAt: Date.now()});
  },

  latestVersionId: function () {
    return _.last(this.history).resourceId.toHexString();
  },

  findLatest: function(callback) {
    var resourceModel = mongoose.model(this.resourceType);
    resourceModel.findOne(this.latestVersionId(), function(err, instance) {
      callback(err, instance);
    });
  }
};

ResourceHistorySchema.statics = {
  findInCacheOrLocal: function (resourceId, resourceType, cb) {
    var self = this;
    async.waterfall([
      function(callback) {
        self.findOne({vistaId: resourceId, "resourceType": resourceType}, function(err, resourceHistory) {
          callback(err, resourceHistory);
        });
      },
      function(resourceHistory, callback) {
        if (resourceHistory) {
          callback(resourceHistory);
        } else {
          self.findById(resourceId, function(err, resourceHistory) {
            callback(resourceHistory);
          });
        }
      }
    ], function(resourceHistory) {
      cb(resourceHistory);
    });
  }
};

mongoose.model('ResourceHistory', ResourceHistorySchema);