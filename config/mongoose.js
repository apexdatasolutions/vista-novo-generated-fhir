var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fhir');

var fs = require('fs');
var models_path = __dirname + '/../app/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) {
    require(models_path + '/' + file);
  }
});