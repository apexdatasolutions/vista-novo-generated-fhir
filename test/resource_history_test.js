var assert = require("assert");
var fixtures = require('pow-mongoose-fixtures');

fixtures.load(__dirname + '/fixtures');

require(__dirname + '/../config/mongoose');

var mongoose = require('mongoose');
var ResourceHistory = mongoose.model('ResourceHistory');

describe('ResourceHistory', function() {
  it('should find a cached version of a resource', function() {
    ResourceHistory.findInCacheOrLocal('1', 'Patient', function(resourceHistory) {
      resourceHistory.vistaId.should.equal('1');
      done();
    });
  });
});