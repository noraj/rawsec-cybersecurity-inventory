import {Feature} from '../../feature';
import {
    addClass, removeClass, createCheckItem, createElm, elm, removeElm,
    getText
} from '../../dom';
import {isFn, EMPTY_FN} from '../../types';
import {addEvt, targetEvt, removeEvt} from '../../event';
import {root} from '../../root';

/**
 * Columns Visibility extension
 */
export default class ColsVisibility extends Feature {

    /**
     * Creates an instance of ColsVisibility
     * @param {TableFilter} tf TableFilter instance
     * @param {Object} Configuration object
     */
    constructor(tf, f) {
        super(tf, f.name);

        // Configuration object
        let cfg = this.config;

        /**
         * Module name
         * @type {String}
         */
        this.name = f.name;

        /**
         * Module description
         * @type {String}
         */
        this.desc = f.description || 'Columns visibility manager';

        /**
         * show/hide columns container element
         * @private
         */
        this.spanEl = null;

        /**
         * show/hide columns button element
         * @private
         */
        this.btnEl = null;

        /**
         * show/hide columns main container element
         * @private
         */
        this.contEl = null;

        /**
         * Enable tick to hide a column, defaults to true
         * @type {Boolean}
         */
        this.tickToHide = f.tick_to_hide === false ? false : true;

        /**
         * Enable columns manager UI, defaults to true
         * @type {Boolean}
         */
        this.manager = f.manager === false ? false : true;

        /**
         * Headers HTML table reference only if headers are external
         * @type {DOMElement}
         */
        this.headersTbl = f.headers_table || null;

        /**
         * Headers row index only if headers are external
         * @type {Number}
         */
        this.headersIndex = f.headers_index || 1;

        /**
         * ID of main container element
         * @type {String}
         */
        this.contElTgtId = f.container_target_id || null;

        /**
         * Alternative text for column headers in column manager UI
         * @type {Array}
         */
        this.headersText = f.headers_text || null;

        /**
         * ID of button's container element
         * @type {String}
         */
        this.btnTgtId = f.btn_target_id || null;

        /**
         * Button's text, defaults to Columns&#9660;
         * @type {String}
         */
        this.btnText = f.btn_text || 'Columns&#9660;';

        /**
         * Button's inner HTML
         * @type {String}
         */
        this.btnHtml = f.btn_html || null;

        /**
         * Css class for button
         * @type {String}
         */
        this.btnCssClass = f.btn_css_class || 'colVis';

        /**
         * Columns manager UI close link text, defaults to 'Close'
         * @type {String}
         */
        this.btnCloseText = f.btn_close_text || 'Close';

        /**
         * Columns manager UI close link HTML
         * @type {String}
         */
        this.btnCloseHtml = f.btn_close_html || null;

        /**
         * Css for columns manager UI close link
         * @type {String}
         */
        this.btnCloseCssClass = f.btn_close_css_class || this.btnCssClass;

        /**
         * Extension's stylesheet filename
         * @type {String}
         */
        this.stylesheet = f.stylesheet || 'colsVisibility.css';

        /**
         * Css for columns manager UI span
         * @type {String}
         */
        this.spanCssClass = f.span_css_class || 'colVisSpan';

        /**
         * Css for columns manager UI main container
         * @type {String}
         */
        this.contCssClass = f.cont_css_class || 'colVisCont';

        /**
         * Css for columns manager UI checklist (ul)
         * @type {String}
         */
        this.listCssClass = cfg.list_css_class || 'cols_checklist';

        /**
         * Css for columns manager UI checklist item (li)
         * @type {String}
         */
        this.listItemCssClass = cfg.checklist_item_css_class ||
            'cols_checklist_item';

        /**
         * Css for columns manager UI checklist item selected state (li)
         * @type {String}
         */
        this.listSlcItemCssClass = cfg.checklist_selected_item_css_class ||
            'cols_checklist_slc_item';

        /**
         * Text preceding the columns list, defaults to 'Hide' or 'Show'
         * depending on tick mode (tick_to_hide option)
         * @type {String}
         */
        this.text = f.text || (this.tickToHide ? 'Hide: ' : 'Show: ');

        /**
         * List of columns indexes to be hidden at initialization
         * @type {Array}
         */
        this.atStart = f.at_start || [];

        /**
         * Enable hover behaviour on columns manager button/link
         * @type {Boolean}
         */
        this.enableHover = Boolean(f.enable_hover);

        /**
         * Enable select all option, disabled by default
         * @type {Boolean}
         */
        this.enableTickAll = Boolean(f.enable_tick_all);

        /**
         * Text for select all option, defaults to 'Select all:'
         * @type {String}
         */
        this.tickAllText = f.tick_all_text || 'Select all:';

        /**
         * List of indexes of hidden columns
         * @private
         */
        this.hiddenCols = [];

        /**
         * Bound mouseup wrapper
         * @private
         */
        this.boundMouseup = null;

        /**
         * Callback fired when the extension is initialized
         * @type {Function}
         */
        this.onLoaded = isFn(f.on_loaded) ? f.on_loaded : EMPTY_FN;

        /**
         * Callback fired before the columns manager is opened
         * @type {Function}
         */
        this.onBeforeOpen = isFn(f.on_before_open) ?
            f.on_before_open : EMPTY_FN;

        /**
         * Callback fired after the columns manager is opened
         * @type {Function}
         */
        this.onAfterOpen = isFn(f.on_after_open) ? f.on_after_open : EMPTY_FN;

        /**
         * Callback fired before the columns manager is closed
         * @type {Function}
         */
        this.onBeforeClose = isFn(f.on_before_close) ?
            f.on_before_close : EMPTY_FN;

        /**
         * Callback fired after the columns manager is closed
         * @type {Function}
         */
        this.onAfterClose = isFn(f.on_after_close) ?
            f.on_after_close : EMPTY_FN;

        /**
         * Callback fired before a column is hidden
         * @type {Function}
         */
        this.onBeforeColHidden = isFn(f.on_before_col_hidden) ?
            f.on_before_col_hidden : EMPTY_FN;

        /**
         * Callback fired after a column is hidden
         * @type {Function}
         */
        this.onAfterColHidden = isFn(f.on_after_col_hidden) ?
            f.on_after_col_hidden : EMPTY_FN;

        /**
         * Callback fired before a column is displayed
         * @type {Function}
         */
        this.onBeforeColDisplayed = isFn(f.on_before_col_displayed) ?
            f.on_before_col_displayed : EMPTY_FN;

        /**
         * Callback fired after a column is displayed
         * @type {Function}
         */
        this.onAfterColDisplayed = isFn(f.on_after_col_displayed) ?
            f.on_after_col_displayed : EMPTY_FN;

        //Grid layout support
        if (tf.gridLayout) {
            this.headersTbl = tf.feature('gridLayout').headTbl; //headers table
            this.headersIndex = 0; //headers index
            this.onAfterColDisplayed = function () { };
            this.onAfterColHidden = function () { };
        }

        //Loads extension stylesheet
        tf.import(f.name + 'Style', tf.stylePath + this.stylesheet, null,
            'link');

        this.enable();
    }

    /**
     * Mouse-up event handler handling popup auto-close behaviour
     * @private
     */
    onMouseup(evt) {
        let targetElm = targetEvt(evt);

        while (targetElm && targetElm !== this.contEl
            && targetElm !== this.btnEl) {
            targetElm = targetElm.parentNode;
        }

        if (targetElm !== this.contEl && targetElm !== this.btnEl) {
            this.toggle();
        }

        return;
    }

    /**
     * Toggle columns manager UI
     */
    toggle() {
        // ensure mouseup event handler is removed
        removeEvt(root, 'mouseup', this.boundMouseup);

        let contDisplay = this.contEl.style.display;

        if (contDisplay !== 'inline') {
            this.onBeforeOpen(this);
        }
        if (contDisplay === 'inline') {
            this.onBeforeClose(this);
        }

        this.contEl.style.display = contDisplay === 'inline' ?
            'none' : 'inline';

        if (contDisplay !== 'inline') {
            this.onAfterOpen(this);
            addEvt(root, 'mouseup', this.boundMouseup);
        }
        if (contDisplay === 'inline') {
            this.onAfterClose(this);
        }
    }

    /**
     * Check an item in columns manager UI
     * @private
     */
    checkItem(lbl) {
        let li = lbl.parentNode;
        if (!li || !lbl) {
            return;
        }
        let isChecked = lbl.firstChild.checked;
        let colIndex = lbl.firstChild.getAttribute('id').split('_')[1];
        colIndex = parseInt(colIndex, 10);
        if (isChecked) {
            addClass(li, this.listSlcItemCssClass);
        } else {
            removeClass(li, this.listSlcItemCssClass);
        }

        let hide = false;
        if ((this.tickToHide && isChecked) ||
            (!this.tickToHide && !isChecked)) {
            hide = true;
        }
        this.setHidden(colIndex, hide);
    }

    /**
     * Initializes ColsVisibility instance
     */
    init() {
        if (this.initialized || !this.manager) {
            return;
        }

        this.emitter.on(['hide-column'],
            (tf, colIndex) => this.hideCol(colIndex));

        this.buildBtn();
        this.buildManager();

        /** @inherited */
        this.initialized = true;

        this.boundMouseup = this.onMouseup.bind(this);

        this.emitter.emit('columns-visibility-initialized', this.tf, this);

        // Hide columns at start at very end of initialization, do not move
        // as order is important
        this._hideAtStart();
    }

    /**
     * Build main button UI
     */
    buildBtn() {
        if (this.btnEl) {
            return;
        }
        let tf = this.tf;
        let span = createElm('span');
        span.className = this.spanCssClass;

        //Container element (rdiv or custom element)
        if (!this.btnTgtId) {
            tf.setToolbar();
        }
        let targetEl = !this.btnTgtId ? tf.rDiv : elm(this.btnTgtId);

        if (!this.btnTgtId) {
            let firstChild = targetEl.firstChild;
            firstChild.parentNode.insertBefore(span, firstChild);
        } else {
            targetEl.appendChild(span);
        }

        if (!this.btnHtml) {
            let btn = createElm('a', ['href', 'javascript:;']);
            btn.className = this.btnCssClass;
            btn.title = this.desc;

            btn.innerHTML = this.btnText;
            span.appendChild(btn);
            if (!this.enableHover) {
                addEvt(btn, 'click', (evt) => this.toggle(evt));
            } else {
                addEvt(btn, 'mouseover', (evt) => this.toggle(evt));
            }
        } else { //Custom html
            span.innerHTML = this.btnHtml;
            let colVisEl = span.firstChild;
            if (!this.enableHover) {
                addEvt(colVisEl, 'click', (evt) => this.toggle(evt));
            } else {
                addEvt(colVisEl, 'mouseover', (evt) => this.toggle(evt));
            }
        }

        this.spanEl = span;
        this.btnEl = this.spanEl.firstChild;

        this.onLoaded(this);
    }

    /**
     * Build columns manager UI
     */
    buildManager() {
        let tf = this.tf;

        let container = !this.contElTgtId ?
            createElm('div') :
            elm(this.contElTgtId);
        container.className = this.contCssClass;

        //Extension description
        let extNameLabel = createElm('p');
        extNameLabel.innerHTML = this.text;
        container.appendChild(extNameLabel);

        //Headers list
        let ul = createElm('ul');
        ul.className = this.listCssClass;

        let tbl = this.headersTbl ? this.headersTbl : tf.tbl;
        let headerIndex = this.headersTbl ?
            this.headersIndex : tf.getHeadersRowIndex();
        let headerRow = tbl.rows[headerIndex];

        //Tick all option
        if (this.enableTickAll) {
            let li = createCheckItem('col__' + tf.id, this.tickAllText,
                this.tickAllText);
            addClass(li, this.listItemCssClass);
            ul.appendChild(li);
            li.check.checked = !this.tickToHide;

            addEvt(li.check, 'click', () => {
                for (let h = 0; h < headerRow.cells.length; h++) {
                    let itm = elm('col_' + h + '_' + tf.id);
                    if (itm && li.check.checked !== itm.checked) {
                        itm.click();
                        itm.checked = li.check.checked;
                    }
                }
            });
        }

        for (let i = 0; i < headerRow.cells.length; i++) {
            let cell = headerRow.cells[i];
            let cellText = this.headersText && this.headersText[i] ?
                this.headersText[i] : this._getHeaderText(cell);
            let liElm = createCheckItem('col_' + i + '_' + tf.id, cellText,
                cellText);
            addClass(liElm, this.listItemCssClass);
            if (!this.tickToHide) {
                addClass(liElm, this.listSlcItemCssClass);
            }
            ul.appendChild(liElm);
            if (!this.tickToHide) {
                liElm.check.checked = true;
            }

            addEvt(liElm.check, 'click', (evt) => {
                let elm = targetEvt(evt);
                let lbl = elm.parentNode;
                this.checkItem(lbl);
            });
        }

        //separator
        let p = createElm('p', ['align', 'center']);
        let btn;
        //Close link
        if (!this.btnCloseHtml) {
            btn = createElm('a', ['href', 'javascript:;']);
            btn.className = this.btnCloseCssClass;
            btn.innerHTML = this.btnCloseText;
            addEvt(btn, 'click', (evt) => this.toggle(evt));
            p.appendChild(btn);
        } else {
            p.innerHTML = this.btnCloseHtml;
            btn = p.firstChild;
            addEvt(btn, 'click', (evt) => this.toggle(evt));
        }

        container.appendChild(ul);
        container.appendChild(p);

        this.btnEl.parentNode.insertBefore(container, this.btnEl);
        this.contEl = container;
    }

    /**
     * Hide or show specified columns
     * @param {Number} colIndex Column index
     * @param {Boolean} hide    Hide column if true or show if false
     */
    setHidden(colIndex, hide) {
        let tf = this.tf;
        let tbl = tf.tbl;

        if (hide) {
            this.onBeforeColHidden(this, colIndex);
        }
        if (!hide) {
            this.onBeforeColDisplayed(this, colIndex);
        }

        this._hideCells(tbl, colIndex, hide);
        if (this.headersTbl) {
            this._hideCells(this.headersTbl, colIndex, hide);
        }

        let hiddenCols = this.hiddenCols;
        let itemIndex = hiddenCols.indexOf(colIndex);
        if (hide) {
            if (itemIndex === -1) {
                this.hiddenCols.push(colIndex);
            }
        } else {
            if (itemIndex !== -1) {
                this.hiddenCols.splice(itemIndex, 1);
            }
        }

        let gridLayout;
        let headTbl;
        let gridColElms;
        if (hide) {
            //This event is fired just after a column is displayed for
            //grid_layout support
            //TODO: grid layout module should be responsible for those
            //calculations
            if (tf.gridLayout) {
                gridLayout = tf.feature('gridLayout');
                headTbl = gridLayout.headTbl;
                gridColElms = gridLayout.colElms;
                let hiddenWidth = parseInt(
                    gridColElms[colIndex].style.width, 10);

                let headTblW = parseInt(headTbl.style.width, 10);
                headTbl.style.width = headTblW - hiddenWidth + 'px';
                tbl.style.width = headTbl.style.width;
            }

            this.onAfterColHidden(this, colIndex);
            this.emitter.emit('column-hidden', tf, this, colIndex,
                this.hiddenCols);
        }

        if (!hide) {
            //This event is fired just after a column is displayed for
            //grid_layout support
            //TODO: grid layout module should be responsible for those
            //calculations
            if (tf.gridLayout) {
                gridLayout = tf.feature('gridLayout');
                headTbl = gridLayout.headTbl;
                gridColElms = gridLayout.colElms;
                let width = parseInt(gridColElms[colIndex].style.width, 10);
                headTbl.style.width =
                    (parseInt(headTbl.style.width, 10) + width) + 'px';
                tf.tbl.style.width = headTbl.style.width;
            }

            this.onAfterColDisplayed(this, colIndex);
            this.emitter.emit('column-shown', tf, this, colIndex,
                this.hiddenCols);
        }
    }

    /**
     * Show specified column
     * @param  {Number} colIndex Column index
     */
    showCol(colIndex) {
        if (colIndex === undefined || !this.isColHidden(colIndex)) {
            return;
        }
        if (this.manager && this.contEl) {
            let itm = elm('col_' + colIndex + '_' + this.tf.id);
            if (itm) {
                itm.click();
            }
        } else {
            this.setHidden(colIndex, false);
        }
    }

    /**
     * Hide specified column
     * @param  {Number} colIndex Column index
     */
    hideCol(colIndex) {
        if (colIndex === undefined || this.isColHidden(colIndex)) {
            return;
        }
        if (this.manager && this.contEl) {
            let itm = elm('col_' + colIndex + '_' + this.tf.id);
            if (itm) {
                itm.click();
            }
        } else {
            this.setHidden(colIndex, true);
        }
    }

    /**
     * Determine if specified column is hidden
     * @param  {Number} colIndex Column index
     */
    isColHidden(colIndex) {
        if (this.hiddenCols.indexOf(colIndex) !== -1) {
            return true;
        }
        return false;
    }

    /**
     * Toggle visibility of specified column
     * @param  {Number} colIndex Column index
     */
    toggleCol(colIndex) {
        if (colIndex === undefined || this.isColHidden(colIndex)) {
            this.showCol(colIndex);
        } else {
            this.hideCol(colIndex);
        }
    }

    /**
     * Return the indexes of the columns currently hidden
     * @return {Array} column indexes
     */
    getHiddenCols() {
        return this.hiddenCols;
    }

    /**
     * Remove the columns manager
     */
    destroy() {
        if (!this.initialized) {
            return;
        }
        if (elm(this.contElTgtId)) {
            elm(this.contElTgtId).innerHTML = '';
        } else {
            this.contEl.innerHTML = '';
            removeElm(this.contEl);
            this.contEl = null;
        }
        this.btnEl.innerHTML = '';
        removeElm(this.btnEl);
        this.btnEl = null;

        this.emitter.off(['hide-column'],
            (tf, colIndex) => this.hideCol(colIndex));

        this.boundMouseup = null;

        this.initialized = false;
    }

    _getHeaderText(cell) {
        if (!cell.hasChildNodes) {
            return '';
        }

        for (let i = 0; i < cell.childNodes.length; i++) {
            let n = cell.childNodes[i];
            if (n.nodeType === 3) {
                return n.nodeValue;
            } else if (n.nodeType === 1) {
                if (n.id && n.id.indexOf('popUp') !== -1) {
                    continue;
                } else {
                    return getText(n);
                }
            }
            continue;
        }
        return '';
    }

    _hideCells(tbl, colIndex, hide) {
        for (let i = 0; i < tbl.rows.length; i++) {
            let row = tbl.rows[i];
            let cell = row.cells[colIndex];
            if (cell) {
                cell.style.display = hide ? 'none' : '';
            }
        }
    }

    _hideAtStart() {
        this.atStart.forEach((colIdx) => {
            this.hideCol(colIdx);
        });
    }
}
