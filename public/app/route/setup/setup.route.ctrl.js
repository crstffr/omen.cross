import {Groups} from '../../data/groups';

export default class {

    constructor () {

        this.groups = [];
        this.groupName = '';
        this.addingGroup = false;
        this.ready = false;

        Groups.api.on('created', () => this.fetchGroups());
        Groups.api.on('removed', () => this.fetchGroups());
        this.fetchGroups().then(() => this.ready = true);
    }

    fetchGroups() {
        console.log('fetching groups');
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
            devices: [],
            name: this.groupName
        }, () => {
            this.addGroupFormCancel();
        });
    }

    deleteGroup(group) {
        Groups.api.remove(group._id);
    }

}