// create express object to be returned
var express = require('express');
var provider = require('./mongoose.js')

// create app object and setup as exported member of module
var app = express();


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
