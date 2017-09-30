import Register from '../../registry';
import template from './add-group-form.html!text';
import Groups from '../../database/groups';

Register.component('addGroupForm', {
    template: template,
    bindings: {
        closeForm: '&',
    },
    controller: class {

        form;
        closeForm;

        submit() {

            if (!this.form.$valid) { return; }

            Groups.api.create({
                devices: [],
                name: this.form.name
            }, () => {
                this.closeForm();
            });

        }

    }
});



