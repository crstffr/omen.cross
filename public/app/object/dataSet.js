
import test from '../util/rules';
import ObjectObservable from 'oo';
import redraw from '../service/redraw';
import Database from '../service/database';
import {EventHandler} from './eventHandler';

/**
 * @TODO: cleanup handlers on destroy
 */
export default class DataSet {

    data = [];
    table = '';
    rules = {};
    handler = {};
    original = {};
    watchers = [];
    unwatch = () => {};
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
        Object.defineProperty(this, 'array', { get: () => Object.values(this.collection) });
        Object.defineProperty(this, 'length', { get: () => Object.keys(this.collection).length });

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

    destroy() {
        if (this.handler) {
            Object.values(this.handler)
                  .forEach(handler => handler.destroy());
        }
        if (this.watchers) {
            // stop watching any running observables
            this.watchers.forEach(watcher => watcher());
        }
        /*
        delete this['collection'];
        delete this['handler'];
        delete this['api'];
        */
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

        // Force Angular to redraw after anything happens from DB.

        this.api.after(() => redraw());
    }

    /**
     * Make a group of sane event handlers for when the proxy is modified
     * or when data is manipulated from elsewhere.
     */
    setupProxyHandlers() {

        this.handler = {
            change: new EventHandler(),
            create: new EventHandler(),
            remove: new EventHandler(),
            update: new EventHandler()
        };

        this.onChange = fn => this.handler.change.register(fn);
        this.onCreate = fn => this.handler.create.register(fn);
        this.onRemove = fn => this.handler.remove.register(fn);
        this.onUpdate = fn => this.handler.update.register(fn);

        this.watch(changes => {
            if (!changes) { return; }
            this.handler.change.trigger(changes);
            changes.forEach(change => {
                switch (change.type) {
                    case 'set':
                        if (!change.target._id) { break; }
                        this.handler.create.trigger(change.target);
                        break;
                }
            });
        });

        // When items are created at the DB level, add them to our proxy.

        this.api.on('created', item => {
            if (test(item, this.rules)) {
                this.addItem(item);
            }
        });

        // When items are removed at the DB level, remove them from the proxy.

        this.api.on('removed', item => {
            if (test(item, this.rules)) {
                delete this.collection[item._id];
                this.handler.remove.trigger(item);
            }
        });

        // When items are updated at the DB level, update them in the proxy.

        this.api.on('updated', item => {
            if (test(item, this.rules)) {
                let oldVal = Object.assign({}, item);
                this.updateItem(item._id, item);
                this.handler.update.trigger(item, oldVal);
            }
        });

        // When items are patched at the DB level, update them in the proxy.

        this.api.on('patched', item => {
            if (test(item, this.rules)) {
                let oldVal = Object.assign({}, item);
                this.updateItem(item._id, item);
                this.handler.update.trigger(item, oldVal);
            }
        });

    }

    watch(fn) {
        let handler = changes => fn(changes);
        let watcher = ObjectObservable.observe(this.collection, handler);
        this.watchers.push(watcher);
        return watcher;
    }

    addItem(item) {
        this.collection[item._id] = item;
    }

    updateItem(id, data) {
        if (this.collection[id]) {
            Object.assign(this.collection[id] || {}, data);
        }
    }

    getMax(field) {
        let max = 0;
        let opts = {query: {$limit: 1, $select: [field], $sort: {}}};
        opts.query.$sort[field] = -1;
        return new Promise(resolve => {
            this.api.find(opts, (n, result) => {
                if (result.length && result[0][field] >= 0) {
                    max = resolve(result[0][field]);
                }
                resolve(max);
            });
        });
    }

    fetchAll(opts) {
        return new Promise(resolve => {
            let query = Object.assign({$sort: {created: 1}}, opts, this.rules);
            this.api.find({query: query}).then(result => {
                result.forEach(item => this.addItem(item));
                resolve(this.collection);
            });
        });
    }

    /*
    fetchSet(opts) {
        return new Promise(resolve => {
            let query = Object.assign({$sort: {created: 1}}, opts, this.rules);
            let uid = this.table + JSON.stringify(query);

            console.log('subset uid', uid);
            this.api.find({query: query}).then(result => {
                resolve(result);
            });
        });
    }
    */

}


