
import ObjectObservable from 'oo';
import Database from '../service/database';
import {EventHandler} from './eventHandler';

export class DataHook {

    data = [];
    original = [];
    onChange = () => {};

    constructor (name) {

        Object.defineProperties(this, {
            data: {
                get: () => this.proxy
            }
        });

        /**
         * Setup an observable data proxy that consumers can watch
         * and react to changes without having to tie into the DB.
         */

        this.proxy = ObjectObservable.create(this.original);

        /**
         * Configure the Database API
         */

        this.api = Database.service(name);

        this.api.after(evt => Database.onChange.trigger(evt));

        this.api.before(evt => {
            if (evt.method === 'create') {
                evt.data.created = Date.now();
            }
            if (evt.method === 'update' || evt.method === 'patch') {
                evt.data.updated = Date.now();
            }
            return evt;
        });

        this.setupHandlers();

    }

    watch(fn) {
        return ObjectObservable.observeInmediate(this.proxy, (changes) => {
            fn(this.proxy, changes);
        });
    }

    /**
     *
     */
    setupHandlers() {

        let onChange = new EventHandler();
        this.onChange = fn => onChange.register(fn);
        this.watch(changes => onChange.trigger(changes));

        // When items are created at the DB level, add them to our proxy.

        this.api.on('created', data => this.proxy.push(data));

        // When items are removed at the DB level, splice them from the proxy.

        this.api.on('removed', data => {
            this.proxy.forEach((item, i) => {
                if (item._id === data._id) {
                    this.proxy.splice(i, 1);
                }
            });
        });

        this.api.on('updated', msg => onChange.trigger(msg));

        this.api.on('patched', msg => onChange.trigger(msg));

    }

    fetchAll(opts) {
        this.proxy.length = 0;
        return new Promise(resolve => {
            let query = Object.assign({}, opts, {$sort: {created: 1}});
            this.api.find({query: query}).then(result => {
                result.forEach(item => this.proxy.push(item));
                resolve(this.proxy);
            });
        });
    }

}


