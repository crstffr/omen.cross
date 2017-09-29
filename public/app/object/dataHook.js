
import Data from '../service/data';
import {EventHandler} from './eventHandler';

export class DataHook {

    constructor (name) {

        this.api = Data.service(name);

        this.api.before(evt => {
            if (evt.method === 'create') {
                evt.data.created = Date.now();
            }
            if (evt.method === 'update' || evt.method === 'patch') {
                evt.data.updated = Date.now();
            }
            return evt;
        });

        this.api.after(evt => Data.onEvent.trigger(evt));

        let onAny = new EventHandler();
        this.api.on('created', msg => onAny.trigger(msg));
        this.api.on('updated', msg => onAny.trigger(msg));
        this.api.on('patched', msg => onAny.trigger(msg));
        this.api.on('removed', msg => onAny.trigger(msg));
        this.onAny = fn => onAny.register(fn);

    }

    fetchAll(opts) {
        return new Promise(resolve => {
            let query = Object.assign({}, opts, {$sort: {created: 1}});
            this.api.find({query: query}).then(result => resolve(result));
        });
    }

}


