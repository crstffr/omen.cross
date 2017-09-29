
class Radio {

    constructor() {
        this.$name = 'RadioService';
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

export let RadioService = new Radio();