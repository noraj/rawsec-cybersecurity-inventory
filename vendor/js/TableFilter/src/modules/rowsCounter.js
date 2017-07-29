import {Feature} from '../feature';
import {createElm, createText, elm, removeElm} from '../dom';
import {isFn, EMPTY_FN} from '../types';

/**
 * Rows counter UI component
 * @export
 * @class RowsCounter
 * @extends {Feature}
 */
export class RowsCounter extends Feature {

    /**
     * Creates an instance of RowsCounter
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'rowsCounter');

        // TableFilter configuration
        let f = this.config;

        /**
         * ID of custom container element
         * @type {String}
         */
        this.targetId = f.rows_counter_target_id || null;

        /**
         * Container DOM element
         * @type {DOMElement}
         * @private
         */
        this.container = null;

        /**
         * Container DOM element for label displaying the total number of rows
         * @type {DOMElement}
         * @private
         */
        this.label = null;

        /**
         * Text preceding the total number of rows
         * @type {String}
         */
        this.text = f.rows_counter_text || 'Rows: ';

        /**
         * Separator symbol appearing between the first and last visible rows of
         * current page when paging is enabled. ie: Rows: 31-40 / 70
         * @type {String}
         */
        this.fromToTextSeparator = f.from_to_text_separator || '-';

        /**
         * Separator symbol appearing between the first and last visible rows of
         * current page and the total number of filterable rows when paging is
         * enabled. ie: Rows: 31-40 / 70
         * @type {String}
         */
        this.overText = f.over_text || ' / ';

        /**
         * Css class for container element
         * @type {String}
         */
        this.cssClass = f.tot_rows_css_class || 'tot';

        /**
         * Callback fired before the counter is refreshed
         * @type {Function}
         */
        this.onBeforeRefreshCounter = isFn(f.on_before_refresh_counter) ?
            f.on_before_refresh_counter : EMPTY_FN;

        /**
         * Callback fired after the counter is refreshed
         * @type {Function}
         */
        this.onAfterRefreshCounter = isFn(f.on_after_refresh_counter) ?
            f.on_after_refresh_counter : EMPTY_FN;
    }

    /**
     * Initializes RowsCounter instance
     */
    init() {
        if (this.initialized) {
            return;
        }

        let tf = this.tf;

        //rows counter container
        let countDiv = createElm('div');
        countDiv.className = this.cssClass;
        //rows counter label
        let countSpan = createElm('span');
        let countText = createElm('span');
        countText.appendChild(createText(this.text));

        // counter is added to defined element
        if (!this.targetId) {
            tf.setToolbar();
        }
        let targetEl = !this.targetId ? tf.lDiv : elm(this.targetId);

        //default container: 'lDiv'
        if (!this.targetId) {
            countDiv.appendChild(countText);
            countDiv.appendChild(countSpan);
            targetEl.appendChild(countDiv);
        }
        else {
            //custom container, no need to append statusDiv
            targetEl.appendChild(countText);
            targetEl.appendChild(countSpan);
        }
        this.container = countDiv;
        this.label = countSpan;

        // subscribe to events
        this.emitter.on(['after-filtering', 'grouped-by-page'],
            () => this.refresh(tf.getValidRowsNb()));
        this.emitter.on(['rows-changed'], () => this.refresh());

        /** @inherited */
        this.initialized = true;
        this.refresh();
    }

    /**
     * Refreshes the rows counter
     * @param {Number} p Optional parameter the total number of rows to display
     * @returns
     */
    refresh(p) {
        if (!this.initialized || !this.isEnabled()) {
            return;
        }

        let tf = this.tf;

        this.onBeforeRefreshCounter(tf, this.label);

        let totTxt;
        if (!tf.paging) {
            if (p && p !== '') {
                totTxt = p;
            } else {
                totTxt = tf.getFilterableRowsNb() - tf.nbHiddenRows;
            }
        } else {
            let paging = tf.feature('paging');
            if (paging) {
                //paging start row
                let pagingStartRow = parseInt(paging.startPagingRow, 10) +
                    ((tf.getValidRowsNb() > 0) ? 1 : 0);
                let pagingEndRow =
                    (pagingStartRow + paging.pagingLength) - 1 <=
                    tf.getValidRowsNb() ?
                        pagingStartRow + paging.pagingLength - 1 :
                        tf.getValidRowsNb();
                totTxt = pagingStartRow + this.fromToTextSeparator +
                    pagingEndRow + this.overText + tf.getValidRowsNb();
            }
        }

        this.label.innerHTML = totTxt;
        this.onAfterRefreshCounter(tf, this.label, totTxt);
    }

    /**
     * Remove feature
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        if (!this.targetId && this.container) {
            removeElm(this.container);
        } else {
            elm(this.targetId).innerHTML = '';
        }
        this.label = null;
        this.container = null;

        // unsubscribe to events
        this.emitter.off(['after-filtering', 'grouped-by-page'],
            () => this.refresh(tf.getValidRowsNb()));
        this.emitter.off(['rows-changed'], () => this.refresh());

        this.initialized = false;
    }
}
