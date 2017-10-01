import IO from '../../service/io';
import Focus from '../../service/focus';
import Register from '../../registry';
import DataSet from '../../object/dataSet';
import template from './device-table-row.html!text';

Register.directive('deviceTableRow', () => {
    return {
        scope: {
            device: '=',
            dataSet: '=set'
        },
        template: template,
        controllerAs: '$ctrl',
        bindToController: true,
        controller: class {

            device = {};
            dataSet = {};
            showForm = false;
            showModal = false;

            getInputs() {
                return IO.getInputOptions(this.device.input);
            }

            getOutputs() {
                return IO.getOutputOptions(this.device.output);
            }

            openModal() {
                this.showModal = true;
            }

            closeModal() {
                this.showModal = false;
                Focus('delete-device-btn:' + this.device._id);
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

                this.dataSet.api.patch(this.device._id, {
                    name: this.form.name,
                    input: this.form.input.value || '',
                    output: this.form.output.value || ''
                }, () => {
                    this.closeForm();
                });
            }

            deleteDevice() {
                this.closeModal();
                this.dataSet.api.remove(this.device._id);
            }
        }
    }
});