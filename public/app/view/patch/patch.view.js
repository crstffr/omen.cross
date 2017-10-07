import Register from '../../registry';
import template from './patch.view.html!text';
import {Devices, RootDevices} from '../../database/devices';
import Groups from '../../database/groups';
import * as $ from '../../util/$'
import dragula from 'dragula';

let $body = window.document.body;

Register.view('patch', {
    $url: '/patch',
    template: template,
    controller: class {

        $root = {};
        groups = {};
        devices = {};
        draggable = {};
        ready = false;

        constructor () {
            this.groups = Groups;
            this.fetch().then(() => {
                this.initDraggables();
                this.ready = true;
            });
        }

        $onInit() {
            this.rootDevices = RootDevices;
            this.$root = $.select('patch-container[type="root"]')[0];
        }

        $onDestroy() {
            delete this['devices'];
            if (this.draggable.destroy) {
                this.draggable.destroy();
            }
        }

        fetch() {
            return new Promise(resolve => {
                Groups.fetchAll({$sort: {index: 1}}).then(groups => {
                    let promises = [];
                    groups.forEach(group => {

                        let subset = new Devices.Subset({
                            group: group._id,
                            patched: false
                        });

                        promises.push(subset.fetchAll().then(() => {
                            this.devices[group._id] = subset;
                        }));

                    });
                    Promise.all(promises).then(resolve);
                });
            });
        }

        initDraggables() {

            this.draggable = dragula([], {
                isContainer: (el) => (el.nodeName === 'PATCH-CONTAINER'),
                accepts: (item, cont, source, sibling) => {

                    item.$ctrl = item.$ctrl || {};
                    cont.$ctrl = cont.$ctrl || {};

                    let type = cont.$ctrl.type || '';
                    let group = cont.$ctrl.group || {};
                    let device = item.$ctrl.device || {};

                    switch (type) {
                        case 'group':
                            if (device.group === group._id) {
                                return true;
                            }
                            break;
                        case 'root':
                            return Boolean(device.input);
                            break;
                        case 'device':
                            return Boolean(device.output);
                            break;
                    }
                }
            }).on('drag', () => {
                $body.classList.add('is-dragging');
            }).on('dragend', () => {
                $body.classList.remove('is-dragging');
            }).on('drop', (item, cont, from, sibling) => {

                let device = item.$ctrl.device;
                let fromType = from.$ctrl.type;
                let toType = cont.$ctrl.type;

                if (toType === 'group') {
                    item.$ctrl.disconnect();
                }

                this.connect(this.$root);

                let prune = true;
                const tR = 'root';
                const tG = 'group';
                const tD = 'device';
                const fT = fromType;
                const tT = toType;

                if (tT === fT) {
                    if ((tT === tG || tT === tR) ||
                       (cont.$ctrl.id === from.$ctrl.id)) {
                        prune = false;
                    }
                }

                if (prune) {
                    item.remove();
                }

            });

        }

        connect(parent) {

            let pType = parent.getAttribute('type');

            $.childrenOf(parent).forEach((child, i) => {

                if (!child.$ctrl) { return; }

                let index = i + 1;
                let cDevice = child.$ctrl.device;
                let pDevice = parent.$ctrl.device || {};
                let patchedTo = (pType === 'root') ? pType : pDevice._id;

                Devices.api.patch(cDevice._id, {
                    patched: true,
                    patchedTo: patchedTo,
                    patchedIndex: index
                });

                let next = $.childOf(child, 'patch-container');

                if (next) {
                    this.connect(next);
                }
            });
        }

        reset() {
            Devices.api.patch(null, {
                patched: false,
                patchedTo: null,
                patchedIndex: null
            });
        }

        autoPatch() {
            let lookup = {};

            let inputs = Devices.array.filter(device => {
                return Boolean(device.input && !device.output);
            });

            let outputs = Devices.array.filter(device => {
                return Boolean(device.output && !device.input);
            });

            inputs.forEach((device, i) => {
                lookup[device.input] = device._id;
                Devices.api.patch(device._id, {
                    patched: true,
                    patchedTo: 'root',
                    patchedIndex: i + 1
                });
            });

            outputs.forEach((device) => {
                let match = lookup[device.output];
                if (!match) { return; }
                Devices.api.patch(device._id, {
                    patched: true,
                    patchedTo: match,
                    patchedIndex: 1
                });
            });
        }
    }
});

