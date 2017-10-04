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

            Groups.getMax('index').then(i => {
                Groups.api.create({
                    index: i + 1,
                    devices: [],
                    name: this.form.name
                }, () => {
                    this.closeForm();
                });
            });
        }
    }
});



