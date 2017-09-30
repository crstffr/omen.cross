import Groups from '../../database/groups';
import Focus from '../../service/focus';

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

    resetIo() {
        this.inputs = Array(16).fill(1);
        this.outputs = Array(16).fill(1);
    }

    fetchGroups() {
        return Groups.fetchAll().then(groups => {
            this.groups = groups;
        });
    }

    openForm() {
        this.showForm = true;
        Focus('group-name');
    }

    closeForm() {
        this.showForm = false;
        Focus('add-group-btn');
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

}