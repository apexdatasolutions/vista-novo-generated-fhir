// create express object to be returned
var express = require('express');
var provider = require('./mongoose.js')

// create app object and setup as exported member of module
var app = express();

// configure the app
app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'eco');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


// setup routes
app.get('/', function(req, res){
    provider.findAll( function(error,collection){
        res.render('index.eco', { 
            locals: {
                title: 'Model Index',
                models: collection
            }
        });
    })
});

exports.app = app;
