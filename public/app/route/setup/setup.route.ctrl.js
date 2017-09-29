import {RadioService} from '../../service/radio.service';
import {Groups} from '../../database/groups';

export default class {

    constructor () {

        this.groups = [];
        this.inputs = [];
        this.outputs = [];
        this.ready = false;
        this.showForm = false;
        
        Groups.api.on('created', () => this.fetchGroups());
        Groups.api.on('removed', () => this.fetchGroups());

        this.fetchGroups().then(() => this.ready = true);
        this.resetIo();
    }

    fetchGroups() {
        return Groups.fetchAll().then(groups => {
            this.groups = groups;
        });
    }

    openForm() {
        this.showForm = true;
        setTimeout(() => {
            RadioService.trigger('addGroup');
        }, 50);
    }

    closeForm() {
        this.showForm = false;
    }

    submitForm() {
        if (!this.form.$valid) { return; }
        Groups.api.create({
            devices: [], // @TODO: remove me
            name: this.form.name
        }, () => {
            this.closeForm();
        });
    }

    deleteGroup(group) {
        Groups.api.remove(group._id);
    }

    resetIo() {
        this.inputs = Array(16).fill(1);
        this.outputs = Array(16).fill(1);
    }

    registerIo() {
        this.resetIo();
        this.groups.forEach((group) => {
            group.devices.forEach((device) => {
                if (device.input) {
                    this.inputs[device.input - 1] = 0;
                }
                if (device.output) {
                    this.outputs[device.output - 1] = 0;
                }
            });
        });
    }

    getInputOptions() {
        return this.inputs.map((val, key) => {
            if (!val) { return false; }
            return {
                value: key + 1,
                label: 'Input ' + (key + 1)
            }
        }).filter(Boolean);
    }

    getOutputOptions() {
        return this.outputs.map((val, key) => {
            if (!val) { return false; }
            return {
                value: key + 1,
                label: 'Output ' + (key + 1)
            }
        }).filter(Boolean);
    }

}