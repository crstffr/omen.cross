import Register from '../../registry';
import template from './patch.view.html!text';
import Devices from '../../database/devices';
import Groups from '../../database/groups';
import dragula from 'dragula';
import $ from '../../util/$';

Register.view('patch', {
    $url: '/patch',
    template: template,
    controller: class {

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

        $onDestroy() {
            if (this.draggable.destroy) {
                this.draggable.destroy();
            }
        }

        initDraggables() {

            let containers = [];
            $('device-container').forEach(el => containers.push(el));
            containers.push($('dropzone')[0]);

            this.draggable = dragula(containers, {
                accepts: (item, cont, source, sibling) => {

                    let type = (cont.nodeName || '').toLowerCase();

                    let itemGroupId = item.getAttribute('device-group');
                    let contGroupId = cont.getAttribute('device-group');
                    let itemOutput = item.getAttribute('device-output');
                    let itemInput = item.getAttribute('device-input');

                    switch (type) {
                        case 'device-container':
                            if (itemGroupId === contGroupId) {
                                return true;
                            }
                            break;
                        case 'dropzone':
                            return Boolean(itemInput);
                            break;
                        case 'dropslot':
                            return Boolean(itemOutput);
                            return false;
                            break;
                    }
                }
            }).on('drop', (item, cont, source, sibling) => {

                console.log('dropped', item, cont);

            });

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
    }
});

