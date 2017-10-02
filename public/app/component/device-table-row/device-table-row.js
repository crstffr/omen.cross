import IO from '../../service/io';
import Focus from '../../service/focus';
import Register from '../../registry';
import DataSet from '../../object/dataSet';
import template from './device-table-row.html!text';
import Modal from '../../component/modal/modal';

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

            id = '';
            modal = {};
            device = {};
            dataSet = {};
            showForm = false;

            $onInit() {
                this.id = this.device._id;
            }

            $onDestroy() {
                this.modal.destroy();
            }

            getInputs() {
                return IO.getInputOptions(this.device.input);
            }

            getOutputs() {
                return IO.getOutputOptions(this.device.output);
            }

            openModal() {
                this.modal = new Modal({
                    text: {
                        title: 'Confirm Delete',
                        body: `
                            You are about to delete <strong>${this.device.name}</strong>.
                            Do you wish to continue?
                        `
                    },
                    controller: {
                        cancel: () => {
                            Focus('delete-device-btn', this.id);
                        },
                        confirm: () => {
                            this.dataSet.api.remove(this.id);
                        }
                    }
                });
            }

            openForm() {

                Object.assign(this.form, {
                    name: this.device.name,
                    input: { value: this.device.input || ''},
                    output: { value: this.device.output || ''}
                });

                this.showForm = true;
                Focus('device-name', this.id);
            }

            closeForm() {
                this.showForm = false;
                Focus('edit-device-btn', this.id);
            }

            submit() {

                if (!this.form.$valid) {
                    Focus('device-name', this.id);
                    return;
                }

                this.dataSet.api.patch(this.id, {
                    name: this.form.name,
                    input: this.form.input.value || '',
                    output: this.form.output.value || ''
                }, () => {
                    this.closeForm();
                });
            }

        }
    }
});