import {Feature} from '../feature';
import {Hash} from './hash';
import {Storage} from './storage';
import {isEmpty} from '../string';
import {isArray, isNull, isString, isUndef} from '../types';

/**
 * Features state object persistable with localStorage, cookie or URL hash
 *
 * @export
 * @class State
 * @extends {Feature}
 */
export class State extends Feature {

    /**
     * Creates an instance of State
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'state');

        let cfg = this.config.state;

        /**
         * Determines whether state is persisted with URL hash
         * @type {Boolean}
         */
        this.enableHash = cfg === true ||
            (isArray(cfg.types) && cfg.types.indexOf('hash') !== -1);

        /**
         * Determines whether state is persisted with localStorage
         * @type {Boolean}
         */
        this.enableLocalStorage = isArray(cfg.types) &&
            cfg.types.indexOf('local_storage') !== -1;

        /**
         * Determines whether state is persisted with localStorage
         * @type {Boolean}
         */
        this.enableCookie = isArray(cfg.types) &&
            cfg.types.indexOf('cookie') !== -1;

        /**
         * Persist filters values, enabled by default
         * @type {Boolean}
         */
        this.persistFilters = cfg.filters === false ? false : true;

        /**
         * Persist current page number when paging is enabled
         * @type {Boolean}
         */
        this.persistPageNumber = Boolean(cfg.page_number);

        /**
         * Persist page length when paging is enabled
         * @type {Boolean}
         */
        this.persistPageLength = Boolean(cfg.page_length);

        /**
         * Persist column sorting
         * @type {Boolean}
         */
        this.persistSort = Boolean(cfg.sort);

        /**
         * Persist columns visibility
         * @type {Boolean}
         */
        this.persistColsVisibility = Boolean(cfg.columns_visibility);

        /**
         * Persist filters row visibility
         * @type {Boolean}
         */
        this.persistFiltersVisibility = Boolean(cfg.filters_visibility);

        /**
         * Cookie duration in hours
         * @type {Boolean}
         */
        this.cookieDuration = !isNaN(cfg.cookie_duration) ?
            parseInt(cfg.cookie_duration, 10) : 87600;

        /**
         * Enable Storage if localStorage or cookie is required
         * @type {Boolean}
         * @private
         */
        this.enableStorage = this.enableLocalStorage || this.enableCookie;

        /**
         * Storage instance if storage is required
         * @type {Storage}
         * @private
         */
        this.storage = null;

        /**
         * Hash instance if URL hash is required
         * @type {Boolean}
         * @private
         */
        this.hash = null;

        /**
         * Current page number
         * @type {Number}
         * @private
         */
        this.pageNb = null;

        /**
         * Current page length
         * @type {Number}
         * @private
         */
        this.pageLength = null;

        /**
         * Current column sorting
         * @type {Object}
         * @private
         */
        this.sort = null;

        /**
         * Current hidden columns
         * @type {Object}
         * @private
         */
        this.hiddenCols = null;

        /**
         * Filters row visibility
         * @type {Boolean}
         * @private
         */
        this.filtersVisibility = null;

        /**
         * State object
         * @type {Object}
         * @private
         */
        this.state = {};

        /**
         * Prefix for column ID
         * @type {String}
         * @private
         */
        this.prfxCol = 'col_';

        /**
         * Prefix for page number ID
         * @type {String}
         * @private
         */
        this.pageNbKey = 'page';

        /**
         * Prefix for page length ID
         * @type {String}
         * @private
         */
        this.pageLengthKey = 'page_length';

        /**
         * Prefix for filters visibility ID
         * @type {String}
         * @private
         */
        this.filtersVisKey = 'filters_visibility';
    }

    /**
     * Initializes State instance
     */
    init() {
        if (this.initialized) {
            return;
        }

        this.emitter.on(['after-filtering'], () => this.update());
        this.emitter.on(['after-page-change', 'after-clearing-filters'],
            (tf, pageNb) => this.updatePage(pageNb));
        this.emitter.on(['after-page-length-change'],
            (tf, pageLength) => this.updatePageLength(pageLength));
        this.emitter.on(['column-sorted'],
            (tf, index, descending) => this.updateSort(index, descending));
        this.emitter.on(['sort-initialized'], () => this._syncSort());
        this.emitter.on(['columns-visibility-initialized'],
            () => this._syncColsVisibility());
        this.emitter.on(['column-shown', 'column-hidden'], (tf, feature,
            colIndex, hiddenCols) => this.updateColsVisibility(hiddenCols));
        this.emitter.on(['filters-visibility-initialized'],
            () => this._syncFiltersVisibility());
        this.emitter.on(['filters-toggled'],
            (tf, extension, visible) => this.updateFiltersVisibility(visible));

        if (this.enableHash) {
            this.hash = new Hash(this);
            this.hash.init();
        }
        if (this.enableStorage) {
            this.storage = new Storage(this);
            this.storage.init();
        }

        /**
         * @inherited
         */
        this.initialized = true;
    }


    /**
     * Update state object based on current features state
     */
    update() {
        if (!this.isEnabled()) {
            return;
        }
        let state = this.state;
        let tf = this.tf;

        if (this.persistFilters) {
            let filterValues = tf.getFiltersValue();

            filterValues.forEach((val, idx) => {
                let key = `${this.prfxCol}${idx}`;

                if (isString(val) && isEmpty(val)) {
                    if (state.hasOwnProperty(key)) {
                        state[key].flt = undefined;
                    }
                } else {
                    state[key] = state[key] || {};
                    state[key].flt = val;
                }
            });
        }

        if (this.persistPageNumber) {
            if (isNull(this.pageNb)) {
                state[this.pageNbKey] = undefined;
            } else {
                state[this.pageNbKey] = this.pageNb;
            }
        }

        if (this.persistPageLength) {
            if (isNull(this.pageLength)) {
                state[this.pageLengthKey] = undefined;
            } else {
                state[this.pageLengthKey] = this.pageLength;
            }
        }

        if (this.persistSort) {
            if (!isNull(this.sort)) {
                // Remove previuosly sorted column
                Object.keys(state).forEach((key) => {
                    if (key.indexOf(this.prfxCol) !== -1 && state[key]) {
                        state[key].sort = undefined;
                    }
                });

                let key = `${this.prfxCol}${this.sort.column}`;
                state[key] = state[key] || {};
                state[key].sort = { descending: this.sort.descending };
            }
        }

        if (this.persistColsVisibility) {
            if (!isNull(this.hiddenCols)) {
                // Clear previuosly hidden columns
                Object.keys(state).forEach((key) => {
                    if (key.indexOf(this.prfxCol) !== -1 && state[key]) {
                        state[key].hidden = undefined;
                    }
                });

                this.hiddenCols.forEach((colIdx) => {
                    let key = `${this.prfxCol}${colIdx}`;
                    state[key] = state[key] || {};
                    state[key].hidden = true;
                });
            }
        }

        if (this.persistFiltersVisibility) {
            if (isNull(this.filtersVisibility)) {
                state[this.filtersVisKey] = undefined;
            } else {
                state[this.filtersVisKey] = this.filtersVisibility;
            }
        }

        this.emitter.emit('state-changed', tf, state);
    }

    /**
     * Refresh page number field on page number changes
     *
     * @param {Number} pageNb Current page number
     */
    updatePage(pageNb) {
        this.pageNb = pageNb;
        this.update();
    }

    /**
     * Refresh page length field on page length changes
     *
     * @param {Number} pageLength Current page length value
     */
    updatePageLength(pageLength) {
        this.pageLength = pageLength;
        this.update();
    }

    /**
     * Refresh column sorting information on sort changes
     *
     * @param index {Number} Column index
     * @param {Boolean} descending Descending manner
     */
    updateSort(index, descending) {
        this.sort = {
            column: index,
            descending: descending
        };
        this.update();
    }

    /**
     * Refresh hidden columns information on columns visibility changes
     *
     * @param {Array} hiddenCols Columns indexes
     */
    updateColsVisibility(hiddenCols) {
        this.hiddenCols = hiddenCols;
        this.update();
    }

    /**
     * Refresh filters visibility on filters visibility change
     *
     * @param {Boolean} visible Visibility flad
     */
    updateFiltersVisibility(visible) {
        this.filtersVisibility = visible;
        this.update();
    }

    /**
     * Override state field
     *
     * @param state State object
     */
    override(state) {
        this.state = state;
    }

    /**
     * Sync stored features state
     */
    sync() {
        let state = this.state;
        let tf = this.tf;

        this._syncFilters();

        if (this.persistPageNumber) {
            let pageNumber = state[this.pageNbKey];
            this.emitter.emit('change-page', tf, pageNumber);
        }

        if (this.persistPageLength) {
            let pageLength = state[this.pageLengthKey];
            this.emitter.emit('change-page-results', tf, pageLength);
        }

        this._syncSort();
        this._syncColsVisibility();
        this._syncFiltersVisibility();
    }

    /**
     * Override current state with passed one and sync features
     *
     * @param {Object} state State object
     */
    overrideAndSync(state) {
        // To prevent state to react to features changes, state is temporarily
        // disabled
        this.disable();
        // State is overriden with passed state object
        this.override(state);
        // New hash state is applied to features
        this.sync();
        // State is re-enabled
        this.enable();
    }

    /**
     * Sync filters with stored values and filter table
     *
     * @private
     */
    _syncFilters() {
        if (!this.persistFilters) {
            return;
        }
        let state = this.state;
        let tf = this.tf;

        Object.keys(state).forEach((key) => {
            if (key.indexOf(this.prfxCol) !== -1) {
                let colIdx = parseInt(key.replace(this.prfxCol, ''), 10);
                let val = state[key].flt;
                tf.setFilterValue(colIdx, val);
            }
        });

        tf.filter();
    }

    /**
     * Sync sorted column with stored sorting information and sort table
     *
     * @private
     */
    _syncSort() {
        if (!this.persistSort) {
            return;
        }
        let state = this.state;
        let tf = this.tf;

        Object.keys(state).forEach((key) => {
            if (key.indexOf(this.prfxCol) !== -1) {
                let colIdx = parseInt(key.replace(this.prfxCol, ''), 10);
                if (!isUndef(state[key].sort)) {
                    let sort = state[key].sort;
                    this.emitter.emit('sort', tf, colIdx, sort.descending);
                }
            }
        });
    }

    /**
     * Sync hidden columns with stored information
     *
     * @private
     */
    _syncColsVisibility() {
        if (!this.persistColsVisibility) {
            return;
        }
        let state = this.state;
        let tf = this.tf;
        let hiddenCols = [];

        Object.keys(state).forEach((key) => {
            if (key.indexOf(this.prfxCol) !== -1) {
                let colIdx = parseInt(key.replace(this.prfxCol, ''), 10);
                if (!isUndef(state[key].hidden)) {
                    hiddenCols.push(colIdx);
                }
            }
        });

        hiddenCols.forEach((colIdx) => {
            this.emitter.emit('hide-column', tf, colIdx);
        });
    }

    /**
     * Sync filters visibility with stored information
     *
     * @private
     */
    _syncFiltersVisibility() {
        if (!this.persistFiltersVisibility) {
            return;
        }
        let state = this.state;
        let tf = this.tf;
        let filtersVisibility = state[this.filtersVisKey];

        this.filtersVisibility = filtersVisibility;
        this.emitter.emit('show-filters', tf, filtersVisibility);
    }

    /**
     * Destroy State instance
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        this.state = {};

        this.emitter.off(['after-filtering'], () => this.update());
        this.emitter.off(['after-page-change', 'after-clearing-filters'],
            (tf, pageNb) => this.updatePage(pageNb));
        this.emitter.off(['after-page-length-change'],
            (tf, index) => this.updatePageLength(index));
        this.emitter.off(['column-sorted'],
            (tf, index, descending) => this.updateSort(index, descending));
        this.emitter.off(['sort-initialized'], () => this._syncSort());
        this.emitter.off(['columns-visibility-initialized'],
            () => this._syncColsVisibility());
        this.emitter.off(['column-shown', 'column-hidden'], (tf, feature,
            colIndex, hiddenCols) => this.updateColsVisibility(hiddenCols));
        this.emitter.off(['filters-visibility-initialized'],
            () => this._syncFiltersVisibility());
        this.emitter.off(['filters-toggled'],
            (tf, extension, visible) => this.updateFiltersVisibility(visible));

        if (this.enableHash) {
            this.hash.destroy();
            this.hash = null;
        }

        if (this.enableStorage) {
            this.storage.destroy();
            this.storage = null;
        }

        this.initialized = false;
    }
}
