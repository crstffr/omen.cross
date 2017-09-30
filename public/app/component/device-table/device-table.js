import Register from '../../registry';
import DataSet from '../../object/dataSet';
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

        $onInit() {
            this.dataSet = new DataSet('devices', {group: this.group._id});
            this.dataSet.onRemove(device => IO.deregisterDevice(device));
            this.dataSet.onCreate(device => IO.registerDevice(device));
            this.dataSet.fetchAll().then(() => this.ready = true);
            this.devices = this.group.devices = this.dataSet.data;
        }

        editDevice(device) {

        }

        updateDevice(device) {

        }

        deleteDevice(device) {
            this.dataSet.api.remove(device._id);
        }

    }
});