import Register from '../../registry';
import template from './patch.view.html!text';
import Devices from '../../database/devices';
import Groups from '../../database/groups';

Register.view('patch', {
    $url: '/patch',
    template: template,
    controller: class {

        groups = {};
        devices = {};
        ready = false;

        constructor () {
            this.groups = Groups;
            this.devices = Devices;
            this.fetch().then(() => this.ready = true);
        }

        fetch() {

            let promises = [];

            Groups.fetchAll({$sort: {index: 1}}).then(groups => {
                groups.forEach(group => {
                    let subset = new Devices.Subset({group: group._id});
                    subset.fetchAll().then(() => group.devices = subset);
                });
            });

            return Promise.all(promises);

        }

    }
});

