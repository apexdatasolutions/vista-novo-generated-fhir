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





// setup routes

// root url
app.get('/', function(req, res){
    provider.findAll( function(error,collection){
        res.render('index', { 
                title: 'Model Index',
                models: collection
        });
    })
});

//index for model
app.get('/:model', function(req,res){
   res.render('test', {
       model: req.params.model
   });
    
});

exports.app = app;
