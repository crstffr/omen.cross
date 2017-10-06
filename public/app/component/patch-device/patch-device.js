import Register from '../../registry';
import template from './patch-device.html!text';

Register.component('patchDevice', {
    template: template,
    bindings: {
        device: '<',
        group: '<',
    },
    controller: class {

        constructor($element) {
            $element[0].$ctrl = this;
        }

        connect(what) {

        }

    }
}, ['$element']);



