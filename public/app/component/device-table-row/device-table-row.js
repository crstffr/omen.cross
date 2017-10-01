import IO from '../../service/io';
import Register from '../../registry';
import DataSet from '../../object/dataSet';
import template from './device-table-row.html!text';

Register.directive('deviceTableRow', () => {
    return {
        template: template,
        controllerAs: '$ctrl',
        scope: {
            device: '=',
            dataSet: '=set'
        },
        bindToController: true,
        controller: class {

            device = {};
            dataSet = {};
            showForm = false;

            getInputs() {
                return IO.getInputOptions(this.device.input);
            }

            getOutputs() {
                return IO.getOutputOptions(this.device.output);
            }

            openForm() {

                Object.assign(this.form, {
                    name: this.device.name,
                    input: { value: this.device.input || ''},
                    output: { value: this.device.output || ''}
                });

                this.showForm = true;
            }

            closeForm() {
                this.showForm = false;
            }

            submit() {

                if (!this.form.$valid) { return; }

                console.log('submit it');

                this.dataSet.api.patch(this.device._id, {
                    name: this.form.name,
                    input: this.form.input.value || '',
                    output: this.form.output.value || ''
                }, () => {
                    this.closeForm();
                });

            }

            deleteDevice() {
                this.dataSet.api.remove(this.device._id);
            }
        }
    }
});