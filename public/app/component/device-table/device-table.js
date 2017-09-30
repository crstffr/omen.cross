import Register from '../../registry';
import {DataHook} from '../../object/dataHook';
import template from './device-table.html!text';
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
            this.dataHook = new DataHook('devices');
            this.devices = this.dataHook.data;
        }

        $onInit() {
            this.fetch().then(() => this.ready = true);
        }

        fetch() {
            return this.dataHook.fetchAll({group: this.group._id}).then((devices) => {
                devices.forEach(device => IO.registerDevice(device));
                this.group.devices = devices;
            });
        }

        editDevice(device) {

        }

        deleteDevice(device) {
            this.dataHook.api.remove(device._id);
            IO.deregisterDevice(device);
        }

    }
});