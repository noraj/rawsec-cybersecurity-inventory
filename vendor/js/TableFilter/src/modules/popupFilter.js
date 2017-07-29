import {Feature} from '../feature';
import {isFn, isUndef, EMPTY_FN} from '../types';
import {createElm, removeElm} from '../dom';
import {addEvt, cancelEvt, stopEvt, targetEvt, removeEvt} from '../event';
import {INPUT, NONE, CHECKLIST, MULTIPLE} from '../const';
import {root} from '../root';

/**
 * Pop-up filter component
 * @export
 * @class PopupFilter
 * @extends {Feature}
 */
export class PopupFilter extends Feature {

    /**
     * Creates an instance of PopupFilter
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'popupFilters');

        // Configuration object
        let f = this.config;

        // Enable external filters
        tf.isExternalFlt = true;
        tf.externalFltTgtIds = [];

        /**
         * Close active popup filter upon filtering, enabled by default
         * @type {Boolean}
         */
        this.closeOnFiltering = f.popup_filters_close_on_filtering === false ?
            false : true;

        /**
         * Filter icon path
         * @type {String}
         */
        this.iconPath = f.popup_filters_image ||
            tf.themesPath + 'icn_filter.gif';

        /**
         * Active filter icon path
         * @type {string}
         */
        this.activeIconPath = f.popup_filters_image_active ||
            tf.themesPath + 'icn_filterActive.gif';

        /**
         * HTML for the filter icon
         * @type {string}
         */
        this.iconHtml = f.popup_filters_image_html ||
            '<img src="' + this.iconPath + '" alt="Column filter" />';

        /**
         * Css class assigned to filter container element
         * @type {String}
         */
        this.containerCssClass = f.popup_div_css_class || 'popUpFilter';

        /**
         * Ensure filter's container element width matches column width, enabled
         * by default
         * @type {Boolean}
         */
        this.adjustToContainer =
            f.popup_filters_adjust_to_container === false ? false : true;

        /**
         * Callback fired before a popup filter is opened
         * @type {Function}
         */
        this.onBeforeOpen = isFn(f.on_before_popup_filter_open) ?
            f.on_before_popup_filter_open : EMPTY_FN;

        /**
         * Callback fired after a popup filter is opened
         * @type {Function}
         */
        this.onAfterOpen = isFn(f.on_after_popup_filter_open) ?
            f.on_after_popup_filter_open : EMPTY_FN;

        /**
         * Callback fired before a popup filter is closed
         * @type {Function}
         */
        this.onBeforeClose = isFn(f.on_before_popup_filter_close) ?
            f.on_before_popup_filter_close : EMPTY_FN;

        /**
         * Callback fired after a popup filter is closed
         * @type {Function}
         */
        this.onAfterClose = isFn(f.on_after_popup_filter_close) ?
            f.on_after_popup_filter_close : EMPTY_FN;

        /**
         * Collection of filters spans
         * @type {Array}
         * @private
         */
        this.fltSpans = [];

        /**
         * Collection of filters icons
         * @type {Array}
         * @private
         */
        this.fltIcons = [];

        /**
         * Collection of filters icons cached after pop-up filters are removed
         * @type {Array}
         * @private
         */
        this.filtersCache = null;

        /**
         * Collection of filters containers
         * @type {Array}
         * @private
         */
        this.fltElms = this.filtersCache || [];

        /**
         * Prefix for pop-up filter container ID
         * @type {String}
         * @private
         */
        this.prfxDiv = 'popup_';

        /**
         * Column index of popup filter currently active
         * @type {Number}
         * @private
         */
        this.activeFilterIdx = -1;
    }

    /**
     * Click event handler for pop-up filter icon
     * @private
     */
    onClick(evt) {
        let elm = targetEvt(evt).parentNode;
        let colIndex = parseInt(elm.getAttribute('ci'), 10);

        this.closeAll(colIndex);
        this.toggle(colIndex);

        if (this.adjustToContainer) {
            let cont = this.fltElms[colIndex],
                header = this.tf.getHeaderElement(colIndex),
                headerWidth = header.clientWidth * 0.95;
            cont.style.width = parseInt(headerWidth, 10) + 'px';
        }
        cancelEvt(evt);
        stopEvt(evt);
    }

    /**
     * Mouse-up event handler handling popup filter auto-close behaviour
     * @private
     */
    onMouseup(evt) {
        if (this.activeFilterIdx === -1) {
            return;
        }
        let targetElm = targetEvt(evt);
        let activeFlt = this.fltElms[this.activeFilterIdx];
        let icon = this.fltIcons[this.activeFilterIdx];

        if (icon === targetElm) {
            return;
        }

        while (targetElm && targetElm !== activeFlt) {
            targetElm = targetElm.parentNode;
        }

        if (targetElm !== activeFlt) {
            this.close(this.activeFilterIdx);
        }

        return;
    }

    /**
     * Initialize DOM elements
     */
    init() {
        if (this.initialized) {
            return;
        }

        let tf = this.tf;

        // Override headers row index if no grouped headers
        // TODO: Because of the filters row generation, headers row index needs
        // adjusting: prevent useless row generation
        if (tf.headersRow <= 1 && isNaN(tf.config().headers_row_index)) {
            tf.headersRow = 0;
        }

        // Adjust headers row index for grid-layout mode
        // TODO: Because of the filters row generation, headers row index needs
        // adjusting: prevent useless row generation
        if (tf.gridLayout) {
            tf.headersRow--;
            this.buildIcons();
        }

        // subscribe to events
        this.emitter.on(['before-filtering'], () => this.setIconsState());
        this.emitter.on(['after-filtering'], () => this.closeAll());
        this.emitter.on(['cell-processed'],
            (tf, cellIndex) => this.changeState(cellIndex, true));
        this.emitter.on(['filters-row-inserted'], () => this.buildIcons());
        this.emitter.on(['before-filter-init'],
            (tf, colIndex) => this.build(colIndex));

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Reset previously destroyed feature
     */
    reset() {
        this.enable();
        this.init();
        this.buildIcons();
        this.buildAll();
    }

    /**
     * Build all filters icons
     */
    buildIcons() {
        let tf = this.tf;

        // TODO: Because of the filters row generation, headers row index needs
        // adjusting: prevent useless row generation
        tf.headersRow++;

        for (let i = 0; i < tf.nbCells; i++) {
            if (tf.getFilterType(i) === NONE) {
                continue;
            }
            let icon = createElm('span', ['ci', i]);
            icon.innerHTML = this.iconHtml;
            let header = tf.getHeaderElement(i);
            header.appendChild(icon);
            addEvt(icon, 'click', (evt) => this.onClick(evt));
            this.fltSpans[i] = icon;
            this.fltIcons[i] = icon.firstChild;
        }
    }

    /**
     * Build all pop-up filters elements
     */
    buildAll() {
        for (let i = 0; i < this.filtersCache.length; i++) {
            this.build(i, this.filtersCache[i]);
        }
    }

    /**
     * Build a specified pop-up filter elements
     * @param  {Number} colIndex Column index
     * @param  {Object} div      Optional container DOM element
     */
    build(colIndex, div) {
        let tf = this.tf;
        let contId = `${this.prfxDiv}${tf.id}_${colIndex}`;
        let cont = div || createElm('div', ['id', contId]);
        cont.className = this.containerCssClass;
        tf.externalFltTgtIds.push(cont.id);

        let header = tf.getHeaderElement(colIndex);
        header.insertBefore(cont, header.firstChild);
        addEvt(cont, 'click', (evt) => stopEvt(evt));
        this.fltElms[colIndex] = cont;
    }

    /**
     * Toggle visibility of specified filter
     * @param  {Number} colIndex Column index
     */
    toggle(colIndex) {
        if (!this.isOpen(colIndex)) {
            this.open(colIndex);
        } else {
            this.close(colIndex);
        }
    }

    /**
     * Open popup filter of specified column
     * @param {Number} colIndex Column index
     */
    open(colIndex) {
        let tf = this.tf,
            container = this.fltElms[colIndex];

        this.onBeforeOpen(this, container, colIndex);

        container.style.display = 'block';
        this.activeFilterIdx = colIndex;
        addEvt(root, 'mouseup', (evt) => this.onMouseup(evt));

        if (tf.getFilterType(colIndex) === INPUT) {
            let flt = tf.getFilterElement(colIndex);
            if (flt) {
                flt.focus();
            }
        }

        this.onAfterOpen(this, container, colIndex);
    }

    /**
     * Close popup filter of specified column
     * @param {Number} colIndex Column index
     */
    close(colIndex) {
        let container = this.fltElms[colIndex];

        this.onBeforeClose(this, container, colIndex);

        container.style.display = NONE;
        if (this.activeFilterIdx === colIndex) {
            this.activeFilterIdx = -1;
        }
        removeEvt(root, 'mouseup', (evt) => this.onMouseup(evt));

        this.onAfterClose(this, container, colIndex);
    }

    /**
     * Check if popup filter for specified column is open
     * @param {Number} colIndex Column index
     * @returns {Boolean}
     */
    isOpen(colIndex) {
        return this.fltElms[colIndex].style.display === 'block';
    }

    /**
     * Close all filters excepted for the specified one if any
     * @param  {Number} exceptIdx Column index of the filter to not close
     */
    closeAll(exceptIdx) {
        // Do not close filters only if argument is undefined and close on
        // filtering option is disabled
        if (isUndef(exceptIdx) && !this.closeOnFiltering) {
            return;
        }
        for (let i = 0; i < this.fltElms.length; i++) {
            if (i === exceptIdx) {
                continue;
            }
            let fltType = tf.getFilterType(i);
            let isMultipleFilter =
                (fltType === CHECKLIST || fltType === MULTIPLE);

            // Always hide all single selection filter types but hide multiple
            // selection filter types only if index set
            if (!isMultipleFilter || !isUndef(exceptIdx)) {
                this.close(i);
            }
        }
    }

    /**
     * Build all the icons representing the pop-up filters
     */
    setIconsState() {
        for (let i = 0; i < this.fltIcons.length; i++) {
            this.changeState(i, false);
        }
    }

    /**
     * Apply specified icon state
     * @param  {Number} colIndex Column index
     * @param  {Boolean} active   Apply active state
     */
    changeState(colIndex, active) {
        let icon = this.fltIcons[colIndex];
        if (icon) {
            icon.src = active ? this.activeIconPath : this.iconPath;
        }
    }

    /**
     * Remove pop-up filters
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        this.filtersCache = [];
        for (let i = 0; i < this.fltElms.length; i++) {
            let container = this.fltElms[i],
                icon = this.fltSpans[i],
                iconImg = this.fltIcons[i];
            if (container) {
                removeElm(container);
                this.filtersCache[i] = container;
            }
            container = null;
            if (icon) {
                removeElm(icon);
            }
            icon = null;
            if (iconImg) {
                removeElm(iconImg);
            }
            iconImg = null;
        }
        this.fltElms = [];
        this.fltSpans = [];
        this.fltIcons = [];

        // TODO: expose an API to handle external filter IDs
        tf.externalFltTgtIds = [];

        // unsubscribe to events
        this.emitter.off(['before-filtering'], () => this.setIconsState());
        this.emitter.off(['after-filtering'], () => this.closeAll());
        this.emitter.off(['cell-processed'],
            (tf, cellIndex) => this.changeState(cellIndex, true));
        this.emitter.off(['filters-row-inserted'], () => this.buildIcons());
        this.emitter.off(['before-filter-init'],
            (tf, colIndex) => this.build(colIndex));

        this.initialized = false;
    }

}
