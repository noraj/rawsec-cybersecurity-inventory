import {Feature} from '../../feature';
import {createElm, removeElm, elm} from '../../dom';
import {isFn, isUndef, EMPTY_FN} from '../../types';
import {addEvt} from '../../event';

/**
 * Filters Visibility extension
 */
export default class FiltersVisibility extends Feature {

    /**
     * Creates an instance of FiltersVisibility
     * @param {TableFilter} tf TableFilter instance
     * @param {Object} Configuration object
     */
    constructor(tf, f) {
        super(tf, f.name);

        /**
         * Module name
         * @type {String}
         */
        this.name = f.name;

        /**
         * Module description
         * @type {String}
         */
        this.desc = f.description || 'Filters row visibility manager';

        /**
         * Extension's stylesheet filename
         * @type {String}
         */
        this.stylesheet = f.stylesheet || 'filtersVisibility.css';

        /**
         * Expand icon filename
         * @type {String}
         */
        this.icnExpand = f.expand_icon_name || 'icn_exp.png';

        /**
         * Collapse icon filename
         * @type {String}
         */
        this.icnCollapse = f.collapse_icon_name || 'icn_clp.png';

        /**
         * Main container element
         * @private
         */
        this.contEl = null;

        /**
         * Button element
         * @private
         */
        this.btnEl = null;

        /**
         * Expand icon HTML
         * @private
         */
        this.icnExpandHtml = '<img src="' + tf.themesPath + this.icnExpand +
            '" alt="Expand filters" >';

        /**
         * Collapse icon HTML
         * @private
         */
        this.icnCollapseHtml = '<img src="' + tf.themesPath + this.icnCollapse +
            '" alt="Collapse filters" >';

        /**
         * Default text
         * @private
         */
        this.defaultText = 'Toggle filters';

        /**
         * ID of main container element
         * @type {String}
         */
        this.targetId = f.target_id || null;

        /**
         * Enable expand/collapse icon, defaults to true
         * @type {Boolean}
         */
        this.enableIcon = f.enable_icon === false ? false : true;

        /**
         * Custom text for button
         * @type {String}
         */
        this.btnText = f.btn_text || '';

        /**
         * Collapse button HTML
         * @private
         */
        this.collapseBtnHtml = this.enableIcon ?
            this.icnCollapseHtml + this.btnText :
            this.btnText || this.defaultText;

        /**
         * Expand button HTML
         * @private
         */
        this.expandBtnHtml = this.enableIcon ?
            this.icnExpandHtml + this.btnText :
            this.btnText || this.defaultText;

        /**
         * Button's custom HTML
         * @type {String}
         */
        this.btnHtml = f.btn_html || null;

        /**
         * Css class for expand/collapse filters button
         * @type {String}
         */
        this.btnCssClass = f.btn_css_class || 'btnExpClpFlt';

        /**
         * Css class for main container
         * @type {String}
         */
        this.contCssClass = f.cont_css_class || 'expClpFlt';

        /**
         * Filters row index
         * @type {Number}
         */
        this.filtersRowIndex = !isUndef(f.filters_row_index) ?
            f.filters_row_index : tf.getFiltersRowIndex();

        /**
         * Make filters visible at initialization, defaults to true
         * @type {Boolean}
         */
        this.visibleAtStart = !isUndef(f.visible_at_start) ?
            Boolean(f.visible_at_start) : true;

        /**
         * Callback fired before filters row is shown
         * @type {Function}
         */
        this.onBeforeShow = isFn(f.on_before_show) ?
            f.on_before_show : EMPTY_FN;

        /**
         * Callback fired after filters row is shown
         * @type {Function}
         */
        this.onAfterShow = isFn(f.on_after_show) ? f.on_after_show : EMPTY_FN;

        /**
         * Callback fired before filters row is hidden
         * @type {Function}
         */
        this.onBeforeHide = isFn(f.on_before_hide) ?
            f.on_before_hide : EMPTY_FN;

        /**
         * Callback fired after filters row is hidden
         * @type {Function}
         */
        this.onAfterHide = isFn(f.on_after_hide) ? f.on_after_hide : EMPTY_FN;

        //Import extension's stylesheet
        tf.import(f.name + 'Style', tf.stylePath + this.stylesheet, null,
            'link');

        this.enable();
    }

    /**
     * Initialise extension
     */
    init() {
        if (this.initialized) {
            return;
        }

        this.buildUI();

        /**
         * @inherited
         */
        this.initialized = true;

        this.emitter.on(['show-filters'], (tf, visible) => this.show(visible));
        this.emitter.emit('filters-visibility-initialized', this.tf, this);
    }

    /**
     * Build UI elements
     */
    buildUI() {
        let tf = this.tf;
        let span = createElm('span');
        span.className = this.contCssClass;

        //Container element (rdiv or custom element)
        if (!this.targetId) {
            tf.setToolbar();
        }
        let targetEl = !this.targetId ? tf.rDiv : elm(this.targetId);

        if (!this.targetId) {
            let firstChild = targetEl.firstChild;
            firstChild.parentNode.insertBefore(span, firstChild);
        } else {
            targetEl.appendChild(span);
        }

        let btn;
        if (!this.btnHtml) {
            btn = createElm('a', ['href', 'javascript:void(0);']);
            btn.className = this.btnCssClass;
            btn.title = this.btnText || this.defaultText;
            btn.innerHTML = this.collapseBtnHtml;
            span.appendChild(btn);
        } else { //Custom html
            span.innerHTML = this.btnHtml;
            btn = span.firstChild;
        }

        addEvt(btn, 'click', () => this.toggle());

        this.contEl = span;
        this.btnEl = btn;

        if (!this.visibleAtStart) {
            this.toggle();
        }
    }

    /**
     * Toggle filters visibility
     */
    toggle() {
        let tf = this.tf;
        let tbl = tf.gridLayout ? tf.feature('gridLayout').headTbl : tf.tbl;
        let fltRow = tbl.rows[this.filtersRowIndex];
        let isDisplayed = fltRow.style.display === '';

        this.show(!isDisplayed);
    }

    /**
     * Show or hide filters
     *
     * @param {boolean} [visible=true] Visibility flag
     */
    show(visible = true) {
        let tf = this.tf;
        let tbl = tf.gridLayout ? tf.feature('gridLayout').headTbl : tf.tbl;
        let fltRow = tbl.rows[this.filtersRowIndex];

        if (visible) {
            this.onBeforeShow(this);
        }
        if (!visible) {
            this.onBeforeHide(this);
        }

        fltRow.style.display = visible ? '' : 'none';
        if (this.enableIcon && !this.btnHtml) {
            this.btnEl.innerHTML = visible ?
                this.collapseBtnHtml : this.expandBtnHtml;
        }

        if (visible) {
            this.onAfterShow(this);
        }
        if (!visible) {
            this.onAfterHide(this);
        }

        this.emitter.emit('filters-toggled', tf, this, visible);
    }

    /**
     * Destroy the UI
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        this.emitter.off(['show-filters'], (tf, visible) => this.show(visible));

        this.btnEl.innerHTML = '';
        removeElm(this.btnEl);
        this.btnEl = null;

        this.contEl.innerHTML = '';
        removeElm(this.contEl);
        this.contEl = null;
        this.initialized = false;
    }

}
