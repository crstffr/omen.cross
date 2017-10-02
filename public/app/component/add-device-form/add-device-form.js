import Register from '../../registry';
import template from './add-device-form.html!text';

import IO from '../../service/io';
import Focus from '../../service/focus';
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

        constructor ($scope) {
            // This is ridiculous. Sometimes I hate Angular. GROSSS!
            let unwatch = $scope.$watch(() => this.form, () => {
                this.form.input = {value: ''};
                this.form.output = {value: ''};
                unwatch();
            });
        }

        $onInit() {
            Focus('add-device-form-name');
        }

        getInputs() {
            return IO.getInputOptions();
        }

        getOutputs() {
            return IO.getOutputOptions();
        }

        submit() {

            if (!this.form.$valid) {
                Focus('add-device-form-name');
                return;
            }

            Devices.api.create({
                group: this.group._id,
                name: this.form.name || '',
                input: this.form.input ? this.form.input.value : '',
                output: this.form.output ? this.form.output.value : ''
            }, () => {
                this.closeForm();
            });
        }
    }
}, ['$scope']);



