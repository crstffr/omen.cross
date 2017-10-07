import Register from '../../registry';
import template from './patch-device.html!text';
import {Devices, RootDevices} from '../../database/devices';
import * as $ from '../../util/$';

Register.component('patchDevice', {
    template: template,
    bindings: {
        device: '<',
        group: '<',
    },
    controller: class {

        constructor($element) {
            this.$element = $element[0];
            $element[0].$ctrl = this;
        }

        $onInit() {
            this.patchedTo = new Devices.Subset({patchedTo: this.device._id});
        }

        icon(what) {

            let d = this.device;
            let isRoot = d.patchedTo === 'root';

            switch (what) {
                case 'sound-input':
                    return ((d.input && !d.output) || isRoot);
                    break;

                case 'sound-output':
                    return (d.output && !d.input);
                    break;

                case 'jack':
                    return !this.icon('sound-input');
                    break;

                case 'patched':
                    return this.patchedTo.array.length > 0;
                    break;
            }
        }

        disconnect(element = this.$element) {

            let ctrl = element.$ctrl;
            if (!ctrl) { return; }

            Devices.api.patch(ctrl.device._id, {
                patchedSource: null,
                patchedIndex: null,
                patchedTo: null,
                patched: false
            });

            $.select('patch-device', element).forEach(child => {
                this.disconnect(child);
            });
        }

        startRootPatch() {
            RootDevices.getMax('patchedIndex').then((i) => {
                Devices.api.patch(this.device._id, {
                    patchedIndex: (i || 0) + 1,
                    patchedTo: 'root',
                    patched: true
                });
            });
        }

        dblclick() {
            let d = this.device;
            if (d.patched) {
                this.disconnect();
            } else if (d.input && !d.output) {
                this.startRootPatch();
            } else {
                console.log('patch IO');
            }
        }
    }
}, ['$element']);



