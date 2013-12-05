// create express object to be returned
var express  = require('express');
var provider = require('./mongoose.js');
var cons      = require('consolidate')

// create app object and setup as exported member of module
var app = express();

//configure app
// assign the swig engine to .html files
app.engine('eco', cons.eco);

// set .html as the default extension 
app.set('view engine', 'eco');
app.set('views', __dirname + '/../app/views');

var patientServiceInvoker = require(__dirname + '/../lib/patient_service_invoker');
var observationServiceInvoker = require(__dirname + '/../lib/observation_service_invoker');
// setup routes

// root url(not necessary)
app.get('/', function(req, res){
    provider.findAll( function(error,collection){
        res.render('index', { 
                title: 'Model Index',
                models: collection
        });
    })
});

//index for model(not necessary)
app.get('/:model', function(req,res){
   var controller = require('../app/controllers/' + req.params.model)
   controller.list(req,res)
   
    
});

//show for model
app.get('/:model/:id/:vid', function(req,res){
   var controller = require('../app/controllers/' + req.params.model)   
   controller.load(req,res,req.params.id,req.params.vid, function(obj) {
      if(obj.constructor.name=="Error")
      {
        console.log("Got an error: " + obj)
        res.send(500)
      } else {
        controller.show(req,res)
      }
      
   });
});

//create for model
app.get('/:model/create', function(req,res){
   var controller = require('../app/controllers/' + req.params.model)
   controller.create(req,res)
});

//update for model
app.put('/:model/update/:id/:vid', function(req,res){
   var controller = require('../app/controllers/' + req.params.model)
   controller.load(req,res,req.params.id,req.params.vid, function(obj) {
     if(obj.constructor.name=="Error")
     {
       console.log("Got an error: " + obj)
       res.send(500)
     } else {
       controller.update(req,res)
     }
   });
});

//destroy for model
app.delete('/:model/destroy/:id/:vid', function(req,res){
  var controller = require('../app/controllers/' + req.params.model)
  controller.load(req,res,req.params.id,req.params.vid, function(obj) {
    if(obj.constructor.name=="Error")
    {
      console.log("Got an error: " + obj)
      res.send(500)
    } else {
      controller.destroy(req,res)
    }
  });
  
});

app.param('model', patientServiceInvoker.checkPatientCache);
app.param('model', observationServiceInvoker.checkObservationCache);

exports.app = app;
