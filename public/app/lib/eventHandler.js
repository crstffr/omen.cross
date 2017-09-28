/**
 * Basic event handler class that can be used to register and unregister
 * handlers in a concise and convenient way.
 *
 * Example:
 *
 *    let onChange = new EventHandler();
 *    let unregister = onChange.register(myCallback);
 *
 *    onChange.trigger('fooBar', 'baz');
 *    unregister();
 *
 * @constructor
 */
export class EventHandler {

    constructor() {
        this.callbacks = [];
    }

    /**
     * Register an arbitrary handler function. Returns a function that when
     * called will unregister the supplied handler.
     *
     * @param {Function} callback
     * @returns {Function} unregister handler
     */
    register(callback) {
        this.callbacks.push(callback);
        return () => {
            this.callbacks = this.callbacks.filter((item) => {
                return (item !== callback);
            });
        };
    };

    /**
     * Execute registered handlers with the same args used to trigger.
     *
     */
    trigger() {
        let args = arguments;
        this.callbacks.forEach((handler) => {
            if (typeof handler === 'function') {
                handler.apply(this, args);
            }
        });
    };

    /**
     * Remove all registered callbacks.
     */
    destroy() {
        this.callbacks.length = 0;
    };

}