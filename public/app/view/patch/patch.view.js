import Register from '../../registry';
import template from './patch.view.html!text';

import Draggable from 'draggable/src/draggable';
import Devices from '../../database/devices';
import Groups from '../../database/groups';

Register.view('patch', {
    $url: '/patch',
    template: template,
    controller: class {

        constructor () {

            this.groups = [];
            this.ready = false;
            this.fetchGroups().then(() => this.ready = true);

        }

        fetchGroups() {
            let promises = [];
            Groups.fetchAll().then(groups => {
                this.groups = groups;
                groups.forEach((group, i) => {
                    promises.push(Devices.fetchAll({group: group._id}).then(devices => {
                        this.groups[i].devices = devices;
                    }));
                });
            });
            return Promise.all(promises);
        }

    }
});

