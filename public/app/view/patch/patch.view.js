import Register from '../../registry';
import template from './patch.view.html!text';
import Devices from '../../database/devices';
import Groups from '../../database/groups';
import * as $ from '../../util/$'
import dragula from 'dragula';

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
                this.ready = true;
                this.initDraggables();
            });
        }

        $onInit() {
            this.$root = $.select('patch-container[type="root"]')[0];
            this.rootDevices = new Devices.Subset({patchedTo: 'root'});
            this.unpatchedDevices = new Devices.Subset({patched: false});
        }

        $onDestroy() {
            if (this.draggable.destroy) {
                this.draggable.destroy();
            }
        }

        fetch() {
            return new Promise(resolve => {
                Groups.fetchAll({$sort: {index: 1}}).then(groups => {
                    let promises = [];
                    groups.forEach(group => {
                        let subset = new Devices.Subset({group: group._id});
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
            }).on('drop', (item, cont, from, sibling) => {

                let device = item.$ctrl.device;
                let fromType = from.$ctrl.type;
                let toType = cont.$ctrl.type;

                switch (toType) {
                    case 'group':
                        // return the device to it's group
                        Devices.api.patch(device._id, {
                            patchedSource: null,
                            patchedIndex: null,
                            patchedTo: null,
                            patched: false
                        });
                        break;
                }

                this.connect();

                if ((toType === 'group' && fromType !== 'group') ||
                    (fromType === 'group' && toType !== 'group')) {
                    item.remove();
                }

            });

        }

        reorderDevices(group) {



        }

        connect(parent = this.$root) {

            let pType = parent.getAttribute('type');

            $.childrenOf(parent).forEach((childElem, i) => {

                let index = i + 1;
                let cDevice = childElem.$ctrl.device;

                switch(pType) {

                    case 'root':
                        Devices.api.patch(cDevice._id, {
                            patched: true,
                            patchedTo: 'root',
                            patchedIndex: index,
                        });
                        break;

                    case 'device':

                        let pDevice = parent.$ctrl.device;

                        Devices.api.patch(cDevice._id, {
                            patched: true,
                            patchedTo: pDevice._id,
                            patchedIndex: index
                        });

                        break;
                }



                let newParent = $.specificChildOf(childElem, 'patch-container');
                this.connect(newParent);

                /*
                let dropslot = this.findDropslot(inputDevice);
                let outputDevices = this.getChildren(dropslot);
                let count = outputDevices.length;

                if (count > 0) {
                    inputDevice.classList.add(connClass);
                    if (count > 1) {
                        inputDevice.classList.add(multClass);
                    }
                    this.connect(dropslot);
                } else {
                    inputDevice.classList.remove(connClass, multClass);
                }
                */

            });
        }

    }
});

