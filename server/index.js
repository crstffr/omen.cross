// var ip = require('ip');
var app = require('./app');
var services = require('./services');
var settings = require('../settings');

var server = app.listen(settings.server.port);

server.once('listening', () => {
  console.log('Webserver at http://' + settings.server.ip + ':' + settings.server.port);
});

app.use('groups', services['groups']);
app.use('devices', services['devices']);
app.use('patches', services['patches']);
app.use('current', services['current']);

var groups = app.service('groups');
var devices = app.service('devices');
var patches = app.service('patches');
var current = app.service('current');

// TODO Remove all of this

// Log Hook Data
const log = name =>
  hook => console.log(
    name,
    hook.type,
    hook.type === 'before' ? hook.data : hook.result,
    hook.method
  );

// For each service, log any action before or after
for (const name of [ 'groups', 'devices', 'patches', 'current' ]) {
  const service = app.service(name)

  service.before({
    all: log(name)
  })

  service.after({
    all: log(name)
  })

}

// Once the server is listening, update the first device with a random name.
// server.once('listening', () => {
//
//   setInterval(() => {
//     devices
//       .find({ $limit: 1 })
//       .then(res => res[0] && devices.patch(res[0]._id, { name: Math.random() }) )
//   }, 3000)
//
// })
