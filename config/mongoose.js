var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fhir');

var fs = require('fs');
var models_path = __dirname + '/../app/models';
var models = fs.readdirSync(models_path);
models.forEach(function (file) {
  if (~file.indexOf('.js')) {
    //console.log('Trying to require %s',file);
    //require(models_path + '/' + file);
  }
});

exports.findAll = function(callback) {
  var temp = []
  models.forEach(function (file) {
    //console.log('Trying to require %s',file);
    temp.push(file.split(".")[0]);
  });
  callback(null,temp);
}