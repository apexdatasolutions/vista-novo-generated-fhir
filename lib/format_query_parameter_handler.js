exports.handleFormatQueryParameter = function(req, res, next) {
  if (req.param('_format') != null) {
    req.headers['accept'] = req.param('_format');
  }
  return next();
};