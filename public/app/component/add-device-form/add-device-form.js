import Register from '../../registry';
import template from './add-device-form.html!text';

import IO from '../../service/io';
import Groups from '../../database/groups';
import Devices from '../../database/devices';

Register.component('addDeviceForm', {
    template: template,
    bindings: {
        group: '<',
        closeForm: '&',
    },
    controller: class {

        form;
        group;
        closeForm;

        constructor () {

        }

        getInputs() {
            return IO.getInputOptions();
        }

        getOutputs() {
            return IO.getOutputOptions();
        }

        submit() {

            if (!this.form.$valid) { return; }

            let device = {
                group: this.group._id,
                name: this.form.name || '',
                input: this.form.input ? this.form.input.value : '',
                output: this.form.output ? this.form.output.value : ''
            };

            Devices.api.create(device, () => {
                this.closeForm();
            });

        }

    }
});



