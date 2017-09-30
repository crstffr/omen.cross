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
            this.groups = Groups.data;
            Groups.fetchAll().then(() => this.ready = true);
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