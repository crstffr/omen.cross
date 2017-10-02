import Register from '../../../registry';
import template from './group.html!text';
import Focus from '../../../service/focus';

Register.component('deviceGroup', {
    template: template,
    bindings: {
        group: '<',
        deleteGroup: '&'
    },
    controller: class {

        group = {};
        showForm = false;

        constructor () {}

        openForm() {
            this.showForm = true;
        }

        closeForm() {
            this.showForm = false;
            Focus('add-device-btn', this.group._id);
        }

    },
});