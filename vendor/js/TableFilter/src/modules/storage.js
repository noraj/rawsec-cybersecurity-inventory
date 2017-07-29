
import Cookie from '../cookie';
import {root} from '../root';

const JSON = root.JSON;
const localStorage = root.localStorage;
const location = root.location;

/**
 * Checks if browser has Storage feature
 */
export const hasStorage = () => {
    return 'Storage' in root;
};

/**
 * Stores the features state in browser's local storage or cookie
 *
 * @export
 * @class Storage
 */
export class Storage {

    /**
     * Creates an instance of Storage
     *
     * @param {State} state Instance of State
     */
    constructor(state) {

        /**
         * State object
         * @type {State}
         * @private
         */
        this.state = state;

        /**
         * TableFilter object
         * @type {TableFilter}
         * @private
         */
        this.tf = state.tf;

        /**
         * Persist with local storage
         * @type {Boolean}
         * @private
         */
        this.enableLocalStorage = state.enableLocalStorage && hasStorage();

        /**
         * Persist with cookie
         * @type {Boolean}
         * @private
         */
        this.enableCookie = state.enableCookie && !this.enableLocalStorage;

        /**
         * Emitter object
         * @type {Emitter}
         * @private
         */
        this.emitter = state.emitter;

        /**
         * Cookie duration in hours from state object
         * @type {Number}
         * @private
         */
        this.duration = state.cookieDuration;
    }


    /**
     * Initializes the Storage object
     */
    init() {
        this.emitter.on(['state-changed'], (tf, state) => this.save(state));
        this.emitter.on(['initialized'], () => this.sync());
    }

    /**
     * Persists the features state on state changes
     *
     * @param {State} state Instance of State
     */
    save(state) {
        if (this.enableLocalStorage) {
            localStorage[this.getKey()] = JSON.stringify(state);
        } else {
            Cookie.write(this.getKey(), JSON.stringify(state), this.duration);
        }
    }

    /**
     * Turns stored string into a State JSON object
     *
     *  @returns {Object} JSON object
     */
    retrieve() {
        let state = null;
        if (this.enableLocalStorage) {
            state = localStorage[this.getKey()];
        } else {
            state = Cookie.read(this.getKey());
        }

        if (!state) {
            return null;
        }
        return JSON.parse(state);
    }

    /**
     * Removes persisted state from storage
     */
    remove() {
        if (this.enableLocalStorage) {
            localStorage.removeItem(this.getKey());
        } else {
            Cookie.remove(this.getKey());
        }
    }

    /**
     * Applies persisted state to features
     */
    sync() {
        let state = this.retrieve();
        if (!state) {
            return;
        }
        // override current state with persisted one and sync features
        this.state.overrideAndSync(state);
    }

    /**
     * Returns the storage key
     *
     * @returns {String} Key
     */
    getKey() {
        return JSON.stringify({
            key: `${this.tf.prfxTf}_${this.tf.id}`,
            path: location.pathname
        });
    }

    /**
     * Release Storage event subscriptions and clear fields
     */
    destroy() {
        this.emitter.off(['state-changed'], (tf, state) => this.save(state));
        this.emitter.off(['initialized'], () => this.sync());

        this.remove();

        this.state = null;
        this.emitter = null;
    }
}
