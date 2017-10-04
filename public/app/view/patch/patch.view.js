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
            this.groups = Groups.data;
            this.devices = Devices.data;
            this.fetchData().then(() => this.ready = true);
        }

        fetchData() {

            let opts = {$sort: {index: 1}};

            return Promise.all([
                Devices.fetchAll(opts),
                Groups.fetchAll(opts)
            ]).then(results => {

                console.log(results);

            });

        }

    }
});

