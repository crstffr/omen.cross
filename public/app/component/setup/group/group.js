import Register from '../../../registry';
import template from './group.html!text';

Register.component('deviceGroup', {
    template: template,
    bindings: {
        group: '<',
        deleteGroup: '&'
    },
    controller: class {

        group = {};
        showForm = false;

        constructor () {

        }

        openForm() {
            this.showForm = true;
            Focus('add-device-form-name');
        }

        closeForm() {
            this.showForm = false;
        }

    },
});