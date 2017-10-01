
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
        Object.defineProperty(this, 'data', { get: () => this.collection });

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
        this.collection = ObjectObservable.create(this.original);

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
                case 'patch':
                case 'update':
                    evt.data.updated = now;
                    break;
            }
        });

        this.api.after(evt => {
            Database.onChange.trigger(evt);
        });
    }

    /**
     * Make a group of sane event handlers for when the proxy is modified
     * or when data is manipulated from elsewhere.     *
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
                this.collection.push(data);
            }
        });

        // When items are removed at the DB level, remove them from the proxy.

        this.api.on('removed', data => {
            if (test(data, this.rules)) {
                this.collection.forEach((item, i) => {
                    if (item._id === data._id) {
                        this.collection.splice(i, 1);
                        onRemove.trigger(data);
                    }
                });
            }
        });

        // When items are updated at the DB level, update them in the proxy.

        this.api.on('updated', data => {
            if (test(data, this.rules)) {
                this.collection.forEach((item, i) => {
                    if (item._id === data._id) {
                        let oldVal = Object.assign({}, item);
                        Object.assign(this.collection[i], data);
                        onUpdate.trigger(data, oldVal);
                    }
                });
            }
        });

        // When items are patched at the DB level, update them in the proxy.

        this.api.on('patched', data => {
            if (test(data, this.rules)) {
                this.collection.forEach((item, i) => {
                    if (item._id === data._id) {
                        let oldVal = Object.assign({}, item);
                        Object.assign(this.collection[i], data);
                        onUpdate.trigger(data, oldVal);
                    }
                });
            }
        });

    }

    watch(fn) {
        return ObjectObservable.observe(this.collection, changes => fn(changes));
    }

    fetchAll(opts) {
        this.collection.length = 0;
        return new Promise(resolve => {
            let query = Object.assign({}, opts, this.rules, {$sort: {created: 1}});
            this.api.find({query: query}).then(result => {
                result.forEach(item => this.collection.push(item));
                resolve(this.collection);
            });
        });
    }

}


