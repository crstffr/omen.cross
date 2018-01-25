import ip from 'ip';
import app from './app/app';
import settings from './settings';
import debounce from './util/debounce';
import patchService from './app/patchService';
import dataServices from './app/dataServices';

app.listen(settings.port);

console.log('Webserver at http://' + settings.ip + ':' + settings.port);

app.use('groups', dataServices['groups']);
app.use('devices', dataServices['devices']);
app.use('library', dataServices['library']);

app.emit('ready');

let deviceService = app.service('devices');
let onDeviceChange = debounce(() => {
    patchService.update();
});
deviceService.on('patched', onDeviceChange);
deviceService.on('updated', onDeviceChange);
deviceService.on('removed', onDeviceChange);

