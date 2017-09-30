
import test from '../util/rules';
import ObjectObservable from 'oo';
import Database from '../service/database';
import {EventHandler} from './eventHandler';

/**
 *
 */
export default class DataSet {

    data = [];
    table = '';
    rules = {};
    original = [];

    onChange = () => {};
    onCreate = () => {};
    onRemove = () => {};
    onUpdate = () => {};

    constructor (table, rules) {

        this.table = table;
        this.rules = rules || {};

        /**
         * Protect the data property so it can't be overwritten.
         */
        Object.defineProperty(this, 'data', { get: () => this.proxy });

        /**
         * Initialize the connection to the database table.
         *
         * @type {FeathersService}
         */
        this.api = Database.service(table);

        /**
         * Setup an observable data proxy that consumers can watch
         * and react to changes without having to tie into the DB.
         */
        this.proxy = ObjectObservable.create(this.original);

        this.setupProxyHandlers();
        this.setupDatabaseHooks();
    }

    /**
     *
     */
    setupDatabaseHooks() {

        this.api.before(evt => {
            let now = Date.now();
            switch (evt.method) {
                case 'create':
                    evt.data.created = now;
                    break;
                case 'update':
                case 'patch':
                    evt.data.updated = now;
                    break;
            }
        });

        this.api.after(evt => {
            Database.onChange.trigger(evt);
        });
    }

    /**
     * Make a group of sane event handlers for when the proxy
     * is modified. This scrubs out the extraneous cruft that
     * is generated by the proxy.
     */
    setupProxyHandlers() {

        let onChange = new EventHandler();
        let onCreate = new EventHandler();
        let onRemove = new EventHandler();
        let onUpdate = new EventHandler();

        this.onChange = fn => onChange.register(fn);
        this.onCreate = fn => onCreate.register(fn);
        this.onRemove = fn => onRemove.register(fn);
        this.onUpdate = fn => onUpdate.register(fn);

        this.watch(changes => {
            onChange.trigger(changes);
            changes.forEach(change => {
                switch (change.type) {
                    case 'set':
                        if (!change.target._id) { break; }
                        onCreate.trigger(change.target);
                        break;
                }
            });
        });

        // When items are created at the DB level, add them to our proxy.

        this.api.on('created', data => {
            if (test(data, this.rules)) {
                this.proxy.push(data);
            }
        });

        // When items are removed at the DB level, remove them from the proxy.

        this.api.on('removed', data => {
            if (test(data, this.rules)) {
                this.proxy.forEach((item, i) => {
                    if (item._id === data._id) {
                        this.proxy.splice(i, 1);
                        onRemove.trigger(data);
                    }
                });
            }
        });

    }

    watch(fn) {
        return ObjectObservable.observe(this.proxy, changes => fn(changes));
    }

    fetchAll(opts) {
        this.proxy.length = 0;
        return new Promise(resolve => {
            let query = Object.assign({}, opts, this.rules, {$sort: {created: 1}});
            this.api.find({query: query}).then(result => {
                result.forEach(item => this.proxy.push(item));
                resolve(this.proxy);
            });
        });
    }

}


