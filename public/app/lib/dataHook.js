
import {DataService} from '../service/data.service';
import {EventHandler} from '../lib/eventHandler';

export class DataHook {

    constructor (name) {

        this.api = DataService.service(name);

        this.api.before(evt => {
            if (evt.method === 'create') {
                evt.data._created = Date.now();
            }
            if (evt.method === 'update') {
                evt.data._updated = Date.now();
            }
        });

        this.api.after(evt => DataService.onEvent.trigger(evt));

        let onAny = new EventHandler();
        this.api.on('created', msg => onAny.trigger(msg));
        this.api.on('updated', msg => onAny.trigger(msg));
        this.api.on('patched', msg => onAny.trigger(msg));
        this.api.on('removed', msg => onAny.trigger(msg));
        this.onAny = fn => onAny.register(fn);

    }

    fetchAll() {
        return new Promise(resolve => {
            this.api.find({query: {$sort: {_created: 1}}}).then(result => resolve(result));
        });
    }

}


