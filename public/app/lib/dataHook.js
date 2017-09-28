
import {DataService} from '../service/data.service';
import {EventHandler} from '../lib/eventHandler';

export class DataHook {

    constructor (name) {
        let onAny = new EventHandler();

        this.api = DataService.service(name);
        this.api.after(evt => DataService.onEvent.trigger(evt));

        this.api.on('created', msg => onAny.trigger(msg));
        this.api.on('updated', msg => onAny.trigger(msg));
        this.api.on('patched', msg => onAny.trigger(msg));
        this.api.on('removed', msg => onAny.trigger(msg));
        this.onAny = fn => onAny.register(fn);

    }

    fetchAll() {
        return new Promise(resolve => {
            this.api.find().then(result => resolve(result));
        });
    }

}


