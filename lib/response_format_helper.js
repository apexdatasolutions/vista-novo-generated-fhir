exports.buildFormatHash = function(modelName, locals, response) {
  var formatHash, renderHTML, renderJSON, renderXML;
  renderHTML = function() {
    return response.render("" + modelName + "/show.html.eco", locals);
  };
  renderJSON = function() {
    return response.render("" + modelName + "/show.json.eco", locals);
  };
  renderXML = function() {
    return response.render("" + modelName + "/show.xml.eco", locals);
  };
  formatHash = {
    'text/html': renderHTML,
    'application/json': renderJSON,
    'application/fhir+json': renderJSON,
    'application/xml': renderXML,
    'application/fhit+xml': renderXML
  };
  return formatHash;
};