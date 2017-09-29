import Register from '../registry';

class RadioService {

    constructor() {
        this.callbacks = {};
    }

    register(evt, fn) {
        this.callbacks[evt] = this.callbacks[evt] || [];
        this.callbacks[evt].push(fn);
        return () => {
            this.callbacks[evt] = this.callbacks[evt].filter((v) => {
                return (v !== fn);
            });
        };
    }

    trigger(evt, ...args) {
        this.callbacks[evt] = this.callbacks[evt] || [];
        this.callbacks[evt].forEach((fn) => {
            fn.apply(this, args);
        });
    }

}

let inst = new RadioService();
Register.value('Radio', inst);
export default inst;