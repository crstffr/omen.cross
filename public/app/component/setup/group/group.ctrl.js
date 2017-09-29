import {RadioService} from '../../../service/radio.service';
import {Devices} from '../../../database/devices';
import {Groups} from '../../../database/groups';

export class GroupCtrl {

    constructor () {

        this.devices = [];
        this.ready = false;
        this.showForm = false;

        Devices.api.on('created', () => this.fetchDevices());
        Devices.api.on('removed', () => this.fetchDevices());

        setTimeout(() => {
            this.fetchDevices().then(() => this.ready = true);
        }, 10);
    }
    
    fetchDevices() {
        return Devices.fetchAll({group: this.data._id}).then((devices) => {
            this.devices = devices;
        });
    }
    
    openForm() {
        this.showForm = true;
        setTimeout(() => {
            RadioService.trigger('addDevice');
        }, 10);
    }

    closeForm() {
        this.showForm = false;
    }

    submitForm() {

        if (!this.form.$valid) { return; }

        let device = {
            name: this.form.name || '',
            input: this.form.input || '',
            output: this.form.output || '',
            group: this.data._id
        };

        Devices.api.create(device, () => {
            this.devices.push(device);
            this.closeForm();
        });
    }

    deleteDevice(device) {
        Devices.api.remove(device._id);
    }

}