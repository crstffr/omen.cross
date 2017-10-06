import Register from '../../registry';
import template from './patch-device.html!text';
import Devices from '../../database/devices';

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

        $onInit() {
            this.patchedTo = new Devices.Subset({patchedTo: this.device._id});
        }

        icon(what) {

            let d = this.device;
            let isRoot = d.patchedTo === 'root';

            switch (what) {
                case 'sound':
                    return ((d.input && !d.output) || isRoot) ||
                            (d.output && !d.input && d.patched);
                    break;

                case 'jack':
                    return !this.icon('sound');
                    break;

                case 'patched':
                    return this.patchedTo.array.length > 0;
                    break;


            }

        }

    }
}, ['$element']);



