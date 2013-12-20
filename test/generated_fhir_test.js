var restler   = require('restler');
var mongoose = require('mongoose');
var fs     = require('fs');
var http   = require('http');
var assert = require("assert");
require(__dirname + '/../config/mongoose');
var Observation = mongoose.model('Observation');
var ResourceHistory = mongoose.model('ResourceHistory');
var observationServiceInvoker = require(__dirname + '/../lib/observation_service_invoker');



var port = 9000;
var hostname = 'localhost';
var host = 'http://' + hostname + ':' + port;


var server = http.createServer(function (req, res) {
    var data = fs.readFileSync(__dirname + '/fixtures/observation.json');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
});

describe('Vista Novo Generated FHIR', function(done){
  
  before(function(done) {
    server.listen(port, hostname);
    var req = {};
    var res = {};
    var next = function(){};
    req = {
      serviceConfig: {
        observations: {
          url: "http://localhost:9000/admin/observation",
          username: 'andy@mitre.org',
          password: 'splatter'
        }
      },
      params: {
        id: '1'
      }
    };
    observationServiceInvoker.checkObservationCache(req, res, function(){done();}, 'observation');
  });

  it('ServiceInvoker should populate database with fixture', function(done) {
    
    Observation.findOne({appliesDateTime : new Date(1357175700000)}, function(err, obs) {
      if (err) console.log(err);
      assert.equal(obs.appliesDateTime.valueOf(),'1357175700000');
      done();
    });

  });    

  it('ResourceHistory should find a cached version of a resource', function(done) {
    ResourceHistory.findInCacheOrLocal('1', 'Observation', function(resourceHistory) {
      assert.equal(resourceHistory.vistaId,'1');
      done();
    });
  });

  after(function() {
    server.close();
  });
});

