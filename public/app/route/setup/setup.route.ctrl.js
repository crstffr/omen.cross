import {Groups} from '../../data/groups';

export default class {

    constructor () {

        this.groups = [];
        this.groupName = '';
        this.addingGroup = false;
        this.ready = false;

        Groups.api.on('create', () => this.fetchGroups());
        this.fetchGroups().then(() => this.ready = true);
    }

    fetchGroups() {
        return Groups.fetchAll().then(groups => {
            this.groups = groups;
        });
    }

    addGroupFormShow() {
        this.addingGroup = true;
    }

    addGroupFormHide() {
        this.addingGroup = false;
    }

    addGroupFormCancel() {
        this.groupName = '';
        this.addGroupFormHide();
    }

    addGroupFormSubmit() {
        Groups.api.create({
            name: this.groupName
        }, () => {
            this.addingGroup = false;
        });
    }

}