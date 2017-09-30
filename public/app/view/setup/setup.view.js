import Register from '../../registry';
import template from './setup.view.html!text';
import Groups from '../../database/groups';
import Focus from '../../service/focus';

Register.view('setup', {
    $url: '/setup',
    template: template,
    controller: class {

        groups = [];
        ready = false;
        showForm = false;

        constructor () {
            Groups.api.on('created', () => this.fetchGroups());
            Groups.api.on('removed', () => this.fetchGroups());
            this.fetchGroups().then(() => this.ready = true);
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

        deleteGroup(group) {
            Groups.api.remove(group._id);
        }

    }
});