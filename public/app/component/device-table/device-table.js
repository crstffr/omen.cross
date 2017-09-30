import Register from '../../registry';
import template from './device-table.html!text';
import Devices from '../../database/devices';
import IO from '../../service/io';

Register.component('deviceTable', {
    template: template,
    bindings: {
        group: '='
    },
    controller: class {

        group = {};
        ready = false;

        constructor () {
            Devices.api.on('created', () => this.fetch());
            Devices.api.on('removed', () => this.fetch());
        }

        $onInit() {
            this.fetch().then(() => this.ready = true);
        }

        fetch() {
            return Devices.fetchAll({group: this.group._id}).then((devices) => {
                devices.forEach(device => IO.registerDevice(device));
                this.group.devices = devices;
            });
        }

        editDevice(device) {

        }

        deleteDevice(device) {
            Devices.api.remove(device._id);
            IO.deregisterDevice(device);
        }

    }
});