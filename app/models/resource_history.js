var mongoose = require('mongoose');
var _ = require('underscore');

var ResourceHistorySchema = new mongoose.Schema({
  resourceType: String,
  history: [{resourceId: ObjectId, createdAt: Date}]
});

ResourceHistorySchema.methods = {
  addVersion: function (resourceId) {
    this.history.push({resourceId: resourceId, createdAt: Date.now});
  },

  latestVersionId: function () {
    return _.last(this.history).createdAt;
  }
};

mongoose.model('ResourceHistory', ResourceHistorySchema);