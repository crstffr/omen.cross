import Register from '../../registry';
import template from './devices.view.html!text';
import Groups from '../../database/groups';
import Focus from '../../service/focus';

Register.view('devices', {
    $url: '/devices',
    template: template,
    controller: class {

        groups = [];
        ready = false;
        showForm = false;

        constructor () {
            this.groups = Groups;
            Groups.fetchAll().then(() => this.ready = true);
        }

        sort(order) {
            order.forEach((id, index) => {
                Groups.api.patch(id, {index: index});
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

    }
});