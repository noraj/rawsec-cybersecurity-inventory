
const NOTIMPLEMENTED = 'Not implemented.';

/**
 * Base class defining the interface of a TableFilter feature
 */
export class Feature {
    /**
     * Creates an instance of Feature
     * @param {Object} tf TableFilter instance
     * @param {String} feature Feature name known by TableFilter
     */
    constructor(tf, feature) {
        /**
         * TableFilter instance
         * @type {TableFilter}
         */
        this.tf = tf;

        /**
         * Feature name
         * @type {String}
         */
        this.feature = feature;

        /**
         * TableFilter feature setting
         * @type {Boolean}
         */
        this.enabled = tf[feature];

        /**
         * TableFilter configuration
         * @type {Object}
         */
        this.config = tf.config();

        /**
         * TableFilter emitter instance
         * @type {Emitter}
         */
        this.emitter = tf.emitter;

        /**
         * Field indicating whether Feature is initialized
         * @type {Boolean}
         */
        this.initialized = false;

        /** Subscribe to destroy event */
        this.emitter.on(['destroy'], () => this.destroy());
    }

    /**
     * Initialize the feature
     */
    init() {
        throw new Error(NOTIMPLEMENTED);
    }

    /**
     * Reset the feature after being disabled
     */
    reset() {
        this.enable();
        this.init();
    }

    /**
     * Destroy the feature
     */
    destroy() {
        throw new Error(NOTIMPLEMENTED);
    }

    /**
     * Enable the feature
     */
    enable() {
        this.enabled = true;
    }

    /**
     * Disable the feature
     */
    disable() {
        this.enabled = false;
    }

    /**
     * Indicate whether the feature is enabled or not
     * @returns {Boolean}
     */
    isEnabled() {
        return this.enabled;
    }
}
