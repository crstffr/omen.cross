var ip = require('ip');
var app = require('./app');
var services = require('./services');
var settings = require('./settings');

app.listen(settings.port);

console.log('Webserver at http://' + settings.ip + ':' + settings.port);

app.use('groups', services['groups']);
app.use('devices', services['devices']);
app.use('patches', services['patches']);
app.use('current', services['current']);

var groups = app.service('groups');
var devices = app.service('devices');
var patches = app.service('patches');
var current = app.service('current');