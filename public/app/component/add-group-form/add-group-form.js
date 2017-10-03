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

            Groups.api.find({
                query: {
                    $limit: 1,
                    $select: ['index'],
                    $sort: {index: -1}
                }
            }, (n, result) => {

                let i = 0;

                if (result.length && result[0].index >= 0) {
                    i  = result[0].index + 1;
                    console.log('new index', i);
                }



                Groups.api.create({
                    index: i,
                    devices: [],
                    name: this.form.name
                }, () => {
                    this.closeForm();
                });


            });

        }

    }
});



