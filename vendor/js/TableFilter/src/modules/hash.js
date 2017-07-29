import {addEvt, removeEvt} from '../event';
import {root} from '../root';

const JSON = root.JSON;
const location = root.location;
const decodeURIComponent = root.decodeURIComponent;
const encodeURIComponent = root.encodeURIComponent;

/**
 * Checks if browser has onhashchange event
 */
export const hasHashChange = () => {
    let docMode = root.documentMode;
    return ('onhashchange' in root) && (docMode === undefined || docMode > 7);
};

/**
 * Manages state via URL hash changes
 *
 * @export
 * @class Hash
 */
export class Hash {

    /**
     * Creates an instance of Hash
     *
     * @param {State} state Instance of State
     */
    constructor(state) {
        /**
         * State object
         * @type {State}
         */
        this.state = state;

        /**
         * Cached URL hash
         * @type {String} Hash string
         * @private
         */
        this.lastHash = null;

        /**
         * Application event emitter instance
         * @type {Emitter}
         */
        this.emitter = state.emitter;

        /**
         * Bound sync wrapper for future use
         * @private
         */
        this.boundSync = null;
    }

    /**
     * Initializes the Hash object
     */
    init() {
        if (!hasHashChange()) {
            return;
        }

        this.lastHash = location.hash;
        //Store a bound sync wrapper
        this.boundSync = this.sync.bind(this);
        this.emitter.on(['state-changed'], (tf, state) => this.update(state));
        this.emitter.on(['initialized'], this.boundSync);
        addEvt(root, 'hashchange', this.boundSync);
    }

    /**
     * Updates the URL hash based on a state change
     *
     * @param {State} state Instance of State
     */
    update(state) {
        let hash = `#${encodeURIComponent(JSON.stringify(state))}`;
        if (this.lastHash === hash) {
            return;
        }

        location.hash = hash;
        this.lastHash = hash;
    }

    /**
     * Converts a URL hash into a state JSON object
     *
     * @param {String} hash URL hash fragment
     * @returns {Object} JSON object
     */
    parse(hash) {
        if (hash.indexOf('#') === -1) {
            return null;
        }
        hash = hash.substr(1);
        return JSON.parse(decodeURIComponent(hash));
    }

    /**
     * Applies current hash state to features
     */
    sync() {
        let state = this.parse(location.hash);
        if (!state) {
            return;
        }
        // override current state with persisted one and sync features
        this.state.overrideAndSync(state);
    }

    /**
     * Release Hash event subscriptions and clear fields
     */
    destroy() {
        this.emitter.off(['state-changed'], (tf, state) => this.update(state));
        this.emitter.off(['initialized'], this.boundSync);
        removeEvt(root, 'hashchange', this.boundSync);

        this.state = null;
        this.lastHash = null;
        this.emitter = null;
    }
}
