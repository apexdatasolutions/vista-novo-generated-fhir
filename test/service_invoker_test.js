var restler   = require('restler'),
    mongoose = require('mongoose'),
    fs     = require('fs'),
    http   = require('http'),
    Observation = mongoose.model('Observation'),
    obsService = require('../lib/observation_service_invoker.js');

require(__dirname + '/../config/mongoose');

var port = 9000;
var hostname = 'localhost';
var host = 'http://' + hostname + ':' + port;

before(function(done){
  var server = http.createServer(function (req, res) {
      var data = fs.readFileSync(__dirname + '/fixtures/observation.json');
      console.log('in listener');
      console.log(data);
      res.writeHead(200, { 'content-encoding': 'json' });
      res.end(data);
  });
  
  server.listen(port, hostname, 511);
});

describe('ServiceInvoker', function(){
  it('should populate database with fixture', function() {
    console.log('foo');
    var req = {};
    var res = {};
    var next = function(){};
    req = {
      observations: {
        url: "http://localhost:9000/admin/observation/",
        username: 'andy@mitre.org',
        password: 'splatter'
      },
      params: {
        id: '1'
      }
    };

    // restler.get("http://localhost:9000/admin/observation").on('complete', function(data){
    //   console.log('called server');
    //   console.log(data);
    // });

    obsService.checkObservationCache(req, res, next, 'observation');
    Observation.findById('1', function(err, obs) {
      obs.id.should.equal('1');
      done();
    });
  });    
});

