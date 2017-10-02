import Register from '../../../registry';
import template from './group.html!text';
import DataSet from '../../../object/dataSet';
import Focus from '../../../service/focus';
import Modal from '../../modal/modal';

Register.component('deviceGroup', {
    template: template,
    bindings: {
        group: '<'
    },
    controller: class {

        id = '';
        group = {};
        modal = {};
        showForm = false;

        $onInit() {
            this.id = this.group._id;
            this.dataSet = new DataSet('groups', {_id: this.id});
        }

        $onDestroy() {
            this.dataSet.destroy();
            if (this.modal.destroy) {
                this.modal.destroy();
            }
            delete this['modal'];
            delete this['dataSet'];
        }

        openModal() {
            this.modal = new Modal({
                text: {
                    title: 'Delete Group?',
                    body: `
                            You are about to delete the <strong>${this.group.name}</strong> group 
                            and all of it's attached devices. Do you wish to continue?
                        `
                },
                controller: {
                    cancel: () => {
                        Focus('delete-group-btn', this.id);
                    },
                    confirm: () => {
                        this.dataSet.api.remove(this.id);
                    }
                }
            });
        }

        openForm() {
            this.showForm = true;
        }

        closeForm() {
            this.showForm = false;
            Focus('add-device-btn', this.group._id);
        }

    },
});