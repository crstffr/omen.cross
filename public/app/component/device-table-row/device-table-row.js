import IO from '../../service/io';
import Focus from '../../service/focus';
import Register from '../../registry';
import DataSet from '../../object/dataSet';
import template from './device-table-row.html!text';
import ConfirmationModal from '../../component/modal/confirm';

Register.directive('deviceTableRow', () => {
    return {
        scope: {
            device: '='
        },
        template: template,
        controllerAs: '$ctrl',
        bindToController: true,
        controller: class {

            id = '';
            modal = {};
            device = {};
            devices = {};
            showForm = false;

            $onInit() {
                this.id = this.device._id;
                this.devices = new DataSet('devices', {_id: this.id});
            }

            $onDestroy() {
                this.devices.destroy();
                if (this.modal.destroy) {
                    this.modal.destroy();
                }
                delete this['modal'];
                delete this['devices'];
            }

            getInputs() {
                return IO.getInputOptions(this.device.input);
            }

            getOutputs() {
                return IO.getOutputOptions(this.device.output);
            }

            openModal() {
                this.modal = new ConfirmationModal({
                    text: {
                        title: 'Delete Device?',
                        body: `
                            You are about to delete the <strong>${this.device.name}</strong> device.
                            Do you wish to continue?
                        `
                    },
                    controller: {
                        cancel: () => {
                            Focus('delete-device-btn', this.id);
                        },
                        confirm: () => {
                            this.devices.api.remove(this.id);
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

                this.devices.api.patch(this.id, {
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