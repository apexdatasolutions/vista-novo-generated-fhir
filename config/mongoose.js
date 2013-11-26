var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fhir');

var fs = require('fs');
var models_path = __dirname + '/../app/models';
var models = fs.readdirSync(models_path);

// NOTE: some models seem to be broken. once fixed, the following code will work

models.forEach(function (file) {
  if (~file.indexOf('.js')) {
    //console.log('Trying to require %s',file);
    require(models_path + '/' + file);
  }
});

// For now, import model for testing
// require(models_path + '/adversereaction.js')
// require(models_path + '/resource_history.js')

exports.findAll = function(callback) {
  var temp = []
  models.forEach(function (file) {
    //console.log('Trying to require %s',file);
    temp.push(file.split(".")[0]);
  });
  callback(null,temp);
}