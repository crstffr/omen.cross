
import {DataService} from '../service/data.service';
import {EventHandler} from '../lib/eventHandler';

export class DataHook {

    constructor (name) {

      this.api = DataService.service(name);

      this.api.before(evt => {
          if (evt.method === 'create') {
              evt.data.created = Date.now();
          }
          if (evt.method === 'update' || evt.method === 'patch') {
              evt.data.updated = Date.now();
          }
          return evt;
      });

      this.api.after(evt => console.log('client side after hook', evt) || DataService.onEvent.trigger(evt));

      let onAny = new EventHandler();
      this.api.on('created', msg => onAny.trigger(msg));
      this.api.on('updated', msg => onAny.trigger(msg));
      this.api.on('patched', msg => onAny.trigger(msg));
      this.api.on('removed', msg => onAny.trigger(msg));
      this.onAny = fn => onAny.register(fn);

      // TODO REMOVE THESE
      this.onAny(msg => console.log('onAny triggered', msg))
      setInterval(() => {
        this.api
          .find({ $limit: 1 })
          .then(res => res[0] && this.api.patch(res[0]._id, { name: Math.random() }) )
      }, 3000)
    }

    fetchAll(opts) {
        let query = Object.assign({}, opts, {$sort: {created: 1}});
        return this.api.find({query: query});
    }

}
