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
            this.dataSet = new DataSet('devices', {group: this.group._id});
            this.dataSet.onRemove(device => IO.deregisterDevice(device));
            this.dataSet.onCreate(device => IO.registerDevice(device));
            this.dataSet.onUpdate((newVal, oldVal) => {
                IO.deregisterDevice(oldVal);
                IO.registerDevice(newVal);
            });

            this.dataSet.fetchAll().then(() => this.ready = true);
            this.devices = this.group.devices = this.dataSet.data;
        }
    }
});