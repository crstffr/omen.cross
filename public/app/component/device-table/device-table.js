import IO from '../../service/io';
import Register from '../../registry';
import DataSet from '../../object/dataSet';
import template from './device-table.html!text';
import '../device-table-row/device-table-row';

Register.component('deviceTable', {
    template: template,
    bindings: {
        group: '='
    },
    controller: class {

        group = {};
        ready = false;

        $onInit() {

            this.devices = new DataSet('devices', {group: this.group._id});
            this.devices.onRemove(device => IO.deregisterDevice(device));
            this.devices.onCreate(device => IO.registerDevice(device));
            this.devices.onUpdate((newVal, oldVal) => {
                IO.deregisterDevice(oldVal);
                IO.registerDevice(newVal);
            });

            this.devices.fetchAll().then(() => this.ready = true);
            this.group.devices = this.devices.data;
        }

        $onDestroy() {
            this.devices.destroy();
            delete this['devices'];
        }
    }
});