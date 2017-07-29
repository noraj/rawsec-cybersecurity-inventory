/**
 * Event emitter class
 */
export class Emitter {
    /**
     * Creates an instance of Emitter.
     */
    constructor() {
        /**
         * Events object
         * @type {Object}
         */
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param  {Array}   evts Collection of event names
     * @param  {Function} fn  Function invoked when event is emitted
     */
    on(evts, fn) {
        evts.forEach((evt) => {
            this.events[evt] = this.events[evt] || [];
            this.events[evt].push(fn);
        });
    }

    /**
     * Unsubscribe to an event
     * @param  {Array}   evts Collection of event names
     * @param  {Function} fn  Function invoked when event is emitted
     */
    off(evts, fn) {
        evts.forEach((evt) => {
            if (evt in this.events) {
                this.events[evt].splice(this.events[evt].indexOf(fn), 1);
            }
        });
    }

    /**
     * Emit an event
     * @param  {String} evt Event name followed by any other argument passed to
     * the invoked function
     */
    emit(evt /*, args...*/) {
        if (evt in this.events) {
            for (let i = 0; i < this.events[evt].length; i++) {
                this.events[evt][i].apply(this, [].slice.call(arguments, 1));
            }
        }
    }
}
