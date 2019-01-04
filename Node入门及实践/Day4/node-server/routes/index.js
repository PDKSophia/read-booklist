module.exports = function(app) {
  app.use('/', require('./user'));
  app.use('/', require('./commodity'));
};
