var ObjectId = require('mongodb').BSONNative.ObjectID;

exports.ResourceHistory = [
  {resourceType: 'Patient', vistaId: '1', history: [{resourceId: new ObjectId, createdAt: Date.now}]}
];