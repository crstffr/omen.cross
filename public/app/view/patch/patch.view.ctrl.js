import {Devices} from '../../database/devices';
import {Groups} from '../../database/groups';

import Draggable from 'draggable/src/draggable';

export default class {

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