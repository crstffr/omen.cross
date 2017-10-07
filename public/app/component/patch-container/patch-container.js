import Register from '../../registry';
import template from './patch-container.html!text';

Register.component('patchContainer', {
    template: template,
    bindings: {
        id: '<',
        type: '@',
        group: '<',
        filter: '@',
        device: '<',
        devices: '<',
    },
    controller: class {

        constructor($element) {
            $element[0].$ctrl = this;
        }

    }
}, ['$element']);



