import {RadioService} from '../../service/radio.service';
import {Groups} from '../../database/groups';

export default class {

    constructor () {

        this.groups = [];
        this.ready = false;
        this.showForm = false;

        Groups.api.on('created', () => this.fetchGroups());
        Groups.api.on('removed', () => this.fetchGroups());
        this.fetchGroups().then(() => this.ready = true);
    }

    fetchGroups() {
        return Groups.fetchAll().then(groups => {
            this.groups = groups;
        });
    }

    addGroupFormShow() {
        this.showForm = true;
        setTimeout(() => {
            RadioService.trigger('addGroup');
        }, 50);
    }

    addGroupFormHide() {
        this.showForm = false;
    }

    addGroupFormDone() {
        this.groupName = '';
        this.addGroupFormHide();
    }

    addGroupFormSubmit() {
        if (!this.form.$valid) { return; }

        Groups.api.create({
            devices: [],
            name: this.form.name
        }, () => {
            this.addGroupFormDone();
        });
    }

    deleteGroup(group) {
        Groups.api.remove(group._id);
    }

}