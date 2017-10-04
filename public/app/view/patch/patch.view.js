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
        ready = false;

        constructor () {
            this.groups = Groups;
            this.fetch().then(() => {
                this.ready = true;
                this.initDraggables();
            });
        }

        $onDestroy() {

        }

        initDraggables() {

            let containers = [];

            $('draggable-container').forEach(el => containers.push(el));
            containers.push($('drop-zone')[0]);


            console.log(containers);

            dragula(containers, {

            })

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

