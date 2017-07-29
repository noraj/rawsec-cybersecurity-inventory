import {Feature} from '../feature';
import {createElm, createOpt, createText, elm, removeElm} from '../dom';
import {isArray, isFn, isNull, EMPTY_FN} from '../types';
import {addEvt, keyCode, removeEvt} from '../event';
import {INPUT, SELECT, NONE, ENTER_KEY} from '../const';

/**
 * Paging UI component
 * @export
 * @class Paging
 * @extends {Feature}
 */
export class Paging extends Feature {

    /**
     * Creates an instance of Paging
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'paging');

        // Configuration object
        var f = this.config;

        /**
         * Css class for the paging buttons (previous, next, etc.)
         * @type {String}
         */
        this.btnPageCssClass = f.paging_btn_css_class || 'pgInp';

         /**
         * Main select DOM element
         * @type {DOMElement}
         */
        this.pagingSlc = null;

        /**
         * Results per page select DOM element
         * @type {DOMElement}
         */
        this.resultsPerPageSlc = null;

        /**
         * ID of custom container element
         * @type {String}
         */
        this.pagingTgtId = f.paging_target_id || null;

        /**
         * Number of rows contained in a page
         * @type {Number}
         */
        this.pagingLength = !isNaN(f.paging_length) ? f.paging_length : 10;

        /**
         * ID of custom container element for the results per page selector
         * @type {String}
         */
        this.resultsPerPageTgtId = f.results_per_page_target_id || null;

        /**
         * Css class for the paging select element
         * @type {String}
         */
        this.pgSlcCssClass = f.paging_slc_css_class || 'pgSlc';

        /**
         * Css class for the paging input element
         * @type {String}
         */
        this.pgInpCssClass = f.paging_inp_css_class || 'pgNbInp';

        /**
         * Label and values for the results per page select, example of usage:
         * ['Records: ', [10,25,50,100]]
         * @type {Array}
         */
        this.resultsPerPage = f.results_per_page || null;

        /**
         * Determines if results per page is configured
         * @type {Boolean}
         */
        this.hasResultsPerPage = isArray(this.resultsPerPage);

        /**
         * Css class for the results per page select
         * @type {String}
         */
        this.resultsSlcCssClass = f.results_slc_css_class || 'rspg';

        /**
         * Css class for the label preceding results per page select
         * @type {String}
         */
        this.resultsSpanCssClass = f.results_span_css_class || 'rspgSpan';

        /**
         * Index of the first row of current page
         * @type {Number}
         * @private
         */
        this.startPagingRow = 0;

        /**
         * Total number of pages
         * @type {Number}
         * @private
         */
        this.nbPages = 0;

        /**
         * Current page number
         * @type {Number}
         * @private
         */
        this.currentPageNb = 1;

        /**
         * Next page button text
         * @type {String}
         */
        this.btnNextPageText = f.btn_next_page_text || '>';

        /**
         * Previous page button text
         * @type {String}
         */
        this.btnPrevPageText = f.btn_prev_page_text || '<';

        /**
         * Last page button text
         * @type {String}
         */
        this.btnLastPageText = f.btn_last_page_text || '>|';

        /**
         * First page button text
         * @type {String}
         */
        this.btnFirstPageText = f.btn_first_page_text || '|<';

        /**
         * Next page button HTML
         * @type {String}
         */
        this.btnNextPageHtml = f.btn_next_page_html ||
            (!tf.enableIcons ? null :
                '<input type="button" value="" class="' + this.btnPageCssClass +
                ' nextPage" title="Next page" />');

        /**
         * Previous page button HTML
         * @type {String}
         */
        this.btnPrevPageHtml = f.btn_prev_page_html ||
            (!tf.enableIcons ? null :
                '<input type="button" value="" class="' + this.btnPageCssClass +
                ' previousPage" title="Previous page" />');

        /**
         * First page button HTML
         * @type {String}
         */
        this.btnFirstPageHtml = f.btn_first_page_html ||
            (!tf.enableIcons ? null :
                '<input type="button" value="" class="' + this.btnPageCssClass +
                ' firstPage" title="First page" />');

        /**
         * Last page button HTML
         * @type {String}
         */
        this.btnLastPageHtml = f.btn_last_page_html ||
            (!tf.enableIcons ? null :
                '<input type="button" value="" class="' + this.btnPageCssClass +
                ' lastPage" title="Last page" />');

        /**
         * Text preceeding page selector drop-down
         * @type {String}
         */
        this.pageText = f.page_text || ' Page ';

        /**
         * Text after page selector drop-down
         * @type {String}
         */
        this.ofText = f.of_text || ' of ';

        /**
         * Css class for the span containing total number of pages
         * @type {String}
         */
        this.nbPgSpanCssClass = f.nb_pages_css_class || 'nbpg';

        /**
         * Determines if paging buttons are enabled (default: true)
         * @type {Boolean}
         */
        this.hasPagingBtns = f.paging_btns === false ? false : true;

        /**
         * Defines page selector type, two possible values: 'select', 'input'
         * @type {String}
         */
        this.pageSelectorType = f.page_selector_type || SELECT;

        /**
         * Callback fired before the page is changed
         * @type {Function}
         */
        this.onBeforeChangePage = isFn(f.on_before_change_page) ?
            f.on_before_change_page : EMPTY_FN;

        /**
         * Callback fired after the page is changed
         * @type {Function}
         */
        this.onAfterChangePage = isFn(f.on_after_change_page) ?
            f.on_after_change_page : EMPTY_FN;

        /**
         * Label preciding results per page select
         * @type {DOMElement}
         * @private
         */
        this.slcResultsTxt = null;
        /**
         * Span containing next page button
         * @type {DOMElement}
         * @private
         */
        this.btnNextCont = null;
        /**
         * Span containing previous page button
         * @type {DOMElement}
         * @private
         */
        this.btnPrevCont = null;
        /**
         * Span containing last page button
         * @type {DOMElement}
         * @private
         */
        this.btnLastCont = null;
        /**
         * Span containing first page button
         * @type {DOMElement}
         * @private
         */
        this.btnFirstCont = null;
        /**
         * Span for tot nb pages
         * @type {DOMElement}
         * @private
         */
        this.pgCont = null;
        /**
         * Span preceding pages select (contains 'Page')
         * @type {DOMElement}
         * @private
         */
        this.pgBefore = null;
        /**
         * Span following pages select (contains ' of ')
         * @type {DOMElement}
         * @private
         */
        this.pgAfter = null;

        var start_row = tf.refRow;
        var nrows = tf.getRowsNb(true);
        //calculates page nb
        this.nbPages = Math.ceil((nrows - start_row) / this.pagingLength);

        var o = this;
        /**
         * Paging DOM events handlers
         * @type {String}
         * @private
         */
        this.evt = {
            slcIndex() {
                return (o.pageSelectorType === SELECT) ?
                    o.pagingSlc.options.selectedIndex :
                    parseInt(o.pagingSlc.value, 10) - 1;
            },
            nbOpts() {
                return (o.pageSelectorType === SELECT) ?
                    parseInt(o.pagingSlc.options.length, 10) - 1 :
                    (o.nbPages - 1);
            },
            next() {
                var nextIndex = o.evt.slcIndex() < o.evt.nbOpts() ?
                    o.evt.slcIndex() + 1 : 0;
                o.changePage(nextIndex);
            },
            prev() {
                var prevIndex = o.evt.slcIndex() > 0 ?
                    o.evt.slcIndex() - 1 : o.evt.nbOpts();
                o.changePage(prevIndex);
            },
            last() {
                o.changePage(o.evt.nbOpts());
            },
            first() {
                o.changePage(0);
            },
            _detectKey(e) {
                var key = keyCode(e);
                if (key === ENTER_KEY) {
                    if (tf.sorted) {
                        tf.filter();
                        o.changePage(o.evt.slcIndex());
                    } else {
                        o.changePage();
                    }
                    this.blur();
                }
            },
            slcPagesChange: null,
            nextEvt: null,
            prevEvt: null,
            lastEvt: null,
            firstEvt: null
        };
    }

    /**
     * Initialize DOM elements
     */
    init() {
        var slcPages;
        var tf = this.tf;
        var evt = this.evt;

        if (this.initialized) {
            return;
        }

        // Check resultsPerPage is in expected format and initialise the
        // results per page component
        if (this.hasResultsPerPage) {
            if (this.resultsPerPage.length < 2) {
                this.hasResultsPerPage = false;
            } else {
                this.pagingLength = this.resultsPerPage[1][0];
                this.setResultsPerPage();
            }
        }

        evt.slcPagesChange = (event) => {
            var slc = event.target;
            this.changePage(slc.selectedIndex);
        };

        // Paging drop-down list selector
        if (this.pageSelectorType === SELECT) {
            slcPages = createElm(SELECT);
            slcPages.className = this.pgSlcCssClass;
            addEvt(slcPages, 'change', evt.slcPagesChange);
        }

        // Paging input selector
        if (this.pageSelectorType === INPUT) {
            slcPages = createElm(INPUT, ['value', this.currentPageNb]);
            slcPages.className = this.pgInpCssClass;
            addEvt(slcPages, 'keypress', evt._detectKey);
        }

        // btns containers
        var btnNextSpan = createElm('span');
        var btnPrevSpan = createElm('span');
        var btnLastSpan = createElm('span');
        var btnFirstSpan = createElm('span');

        if (this.hasPagingBtns) {
            // Next button
            if (!this.btnNextPageHtml) {
                var btnNext = createElm(INPUT,
                    ['type', 'button'],
                    ['value', this.btnNextPageText],
                    ['title', 'Next']
                );
                btnNext.className = this.btnPageCssClass;
                addEvt(btnNext, 'click', evt.next);
                btnNextSpan.appendChild(btnNext);
            } else {
                btnNextSpan.innerHTML = this.btnNextPageHtml;
                addEvt(btnNextSpan, 'click', evt.next);
            }
            // Previous button
            if (!this.btnPrevPageHtml) {
                var btnPrev = createElm(INPUT,
                    ['type', 'button'],
                    ['value', this.btnPrevPageText],
                    ['title', 'Previous']
                );
                btnPrev.className = this.btnPageCssClass;
                addEvt(btnPrev, 'click', evt.prev);
                btnPrevSpan.appendChild(btnPrev);
            } else {
                btnPrevSpan.innerHTML = this.btnPrevPageHtml;
                addEvt(btnPrevSpan, 'click', evt.prev);
            }
            // Last button
            if (!this.btnLastPageHtml) {
                var btnLast = createElm(INPUT,
                    ['type', 'button'],
                    ['value', this.btnLastPageText],
                    ['title', 'Last']
                );
                btnLast.className = this.btnPageCssClass;
                addEvt(btnLast, 'click', evt.last);
                btnLastSpan.appendChild(btnLast);
            } else {
                btnLastSpan.innerHTML = this.btnLastPageHtml;
                addEvt(btnLastSpan, 'click', evt.last);
            }
            // First button
            if (!this.btnFirstPageHtml) {
                var btnFirst = createElm(INPUT,
                    ['type', 'button'],
                    ['value', this.btnFirstPageText],
                    ['title', 'First']
                );
                btnFirst.className = this.btnPageCssClass;
                addEvt(btnFirst, 'click', evt.first);
                btnFirstSpan.appendChild(btnFirst);
            } else {
                btnFirstSpan.innerHTML = this.btnFirstPageHtml;
                addEvt(btnFirstSpan, 'click', evt.first);
            }
        }

        // paging elements (buttons+drop-down list) are added to defined element
        if (!this.pagingTgtId) {
            tf.setToolbar();
        }
        var targetEl = !this.pagingTgtId ? tf.mDiv : elm(this.pagingTgtId);
        targetEl.appendChild(btnFirstSpan);
        targetEl.appendChild(btnPrevSpan);

        var pgBeforeSpan = createElm('span');
        pgBeforeSpan.appendChild(createText(this.pageText));
        pgBeforeSpan.className = this.nbPgSpanCssClass;
        targetEl.appendChild(pgBeforeSpan);
        targetEl.appendChild(slcPages);
        var pgAfterSpan = createElm('span');
        pgAfterSpan.appendChild(createText(this.ofText));
        pgAfterSpan.className = this.nbPgSpanCssClass;
        targetEl.appendChild(pgAfterSpan);
        var pgSpan = createElm('span');
        pgSpan.className = this.nbPgSpanCssClass;
        pgSpan.appendChild(createText(' ' + this.nbPages + ' '));
        targetEl.appendChild(pgSpan);
        targetEl.appendChild(btnNextSpan);
        targetEl.appendChild(btnLastSpan);

        this.btnNextCont = btnNextSpan;
        this.btnPrevCont = btnPrevSpan;
        this.btnLastCont = btnLastSpan;
        this.btnFirstCont = btnFirstSpan;
        this.pgCont = pgSpan;
        this.pgBefore = pgBeforeSpan;
        this.pgAfter = pgAfterSpan;
        this.pagingSlc = slcPages;

        this.setPagingInfo();

        if (!tf.fltGrid) {
            tf.validateAllRows();
            this.setPagingInfo(tf.validRowsIndex);
        }

        this.emitter.on(['after-filtering'], () => this.resetPagingInfo());
        this.emitter.on(['change-page'],
            (tf, pageNumber) => this.setPage(pageNumber));
        this.emitter.on(['change-page-results'],
            (tf, pageLength) => this.changeResultsPerPage(pageLength));

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Reset paging when filters are already instantiated
     * @param {Boolean} filterTable Execute filtering once paging instanciated
     */
    reset(filterTable = false) {
        var tf = this.tf;
        if (this.isEnabled()) {
            return;
        }
        this.enable();
        this.init();

        if (filterTable) {
            tf.filter();
        }
    }

    /**
     * Reset paging info from scratch after a filtering process
     */
    resetPagingInfo() {
        this.startPagingRow = 0;
        this.currentPageNb = 1;
        this.setPagingInfo(this.tf.validRowsIndex);
    }

    /**
     * Calculate number of pages based on valid rows
     * Refresh paging select according to number of pages
     * @param {Array} validRows Collection of valid rows
     */
    setPagingInfo(validRows) {
        var tf = this.tf;
        var mdiv = !this.pagingTgtId ? tf.mDiv : elm(this.pagingTgtId);

        //store valid rows indexes
        tf.validRowsIndex = validRows || tf.getValidRows(true);

        //calculate nb of pages
        this.nbPages = Math.ceil(tf.validRowsIndex.length / this.pagingLength);
        //refresh page nb span
        this.pgCont.innerHTML = this.nbPages;
        //select clearing shortcut
        if (this.pageSelectorType === SELECT) {
            this.pagingSlc.innerHTML = '';
        }

        if (this.nbPages > 0) {
            mdiv.style.visibility = 'visible';
            if (this.pageSelectorType === SELECT) {
                for (var z = 0; z < this.nbPages; z++) {
                    var opt = createOpt(z + 1, z * this.pagingLength, false);
                    this.pagingSlc.options[z] = opt;
                }
            } else {
                //input type
                this.pagingSlc.value = this.currentPageNb;
            }

        } else {
            /*** if no results paging select and buttons are hidden ***/
            mdiv.style.visibility = 'hidden';
        }
        this.groupByPage(tf.validRowsIndex);
    }

    /**
     * Group table rows by page and display valid rows
     * @param  {Array} validRows Collection of valid rows
     */
    groupByPage(validRows) {
        var tf = this.tf;
        var rows = tf.tbl.rows;
        var startPagingRow = parseInt(this.startPagingRow, 10);
        var endPagingRow = startPagingRow + parseInt(this.pagingLength, 10);

        //store valid rows indexes
        if (validRows) {
            tf.validRowsIndex = validRows;
        }

        //this loop shows valid rows of current page
        for (var h = 0, len = tf.getValidRowsNb(true); h < len; h++) {
            var validRowIdx = tf.validRowsIndex[h];
            var r = rows[validRowIdx];
            var isRowValid = r.getAttribute('validRow');
            var rowDisplayed = false;

            if (h >= startPagingRow && h < endPagingRow) {
                if (isNull(isRowValid) || Boolean(isRowValid === 'true')) {
                    r.style.display = '';
                    rowDisplayed = true;
                }
            } else {
                r.style.display = NONE;
            }
            this.emitter.emit('row-paged', tf, validRowIdx, h, rowDisplayed);
        }

        // broadcast grouping by page
        this.emitter.emit('grouped-by-page', tf, this);
    }

    /**
     * Return the current page number
     * @return {Number} Page number
     */
    getPage() {
        return this.currentPageNb;
    }

    /**
     * Show page defined by passed argument (string or number):
     * @param {String}/{Number} cmd possible string values: 'next',
     *   'previous', 'last', 'first' or page number as per param
     */
    setPage(cmd) {
        var tf = this.tf;
        if (!tf.isInitialized() || !this.isEnabled()) {
            return;
        }
        var btnEvt = this.evt,
            cmdtype = typeof cmd;
        if (cmdtype === 'string') {
            switch (cmd.toLowerCase()) {
                case 'next':
                    btnEvt.next();
                    break;
                case 'previous':
                    btnEvt.prev();
                    break;
                case 'last':
                    btnEvt.last();
                    break;
                case 'first':
                    btnEvt.first();
                    break;
                default:
                    btnEvt.next();
                    break;
            }
        }
        else if (cmdtype === 'number') {
            this.changePage(cmd - 1);
        }
    }

    /**
     * Generates UI elements for the number of results per page drop-down
     */
    setResultsPerPage() {
        var tf = this.tf;
        var evt = this.evt;

        if (this.resultsPerPageSlc || !this.resultsPerPage) {
            return;
        }

        evt.slcResultsChange = (ev) => {
            this.onChangeResultsPerPage();
            ev.target.blur();
        };

        var slcR = createElm(SELECT);
        slcR.className = this.resultsSlcCssClass;
        var slcRText = this.resultsPerPage[0],
            slcROpts = this.resultsPerPage[1];
        var slcRSpan = createElm('span');
        slcRSpan.className = this.resultsSpanCssClass;

        // results per page select is added to external element
        if (!this.resultsPerPageTgtId) {
            tf.setToolbar();
        }
        var targetEl = !this.resultsPerPageTgtId ?
            tf.rDiv : elm(this.resultsPerPageTgtId);
        slcRSpan.appendChild(createText(slcRText));

        var help = tf.feature('help');
        if (help && help.btn) {
            help.btn.parentNode.insertBefore(slcRSpan, help.btn);
            help.btn.parentNode.insertBefore(slcR, help.btn);
        } else {
            targetEl.appendChild(slcRSpan);
            targetEl.appendChild(slcR);
        }

        for (var r = 0; r < slcROpts.length; r++) {
            var currOpt = new Option(slcROpts[r], slcROpts[r], false, false);
            slcR.options[r] = currOpt;
        }
        addEvt(slcR, 'change', evt.slcResultsChange);
        this.slcResultsTxt = slcRSpan;
        this.resultsPerPageSlc = slcR;
    }

    /**
     * Remove number of results per page UI elements
     */
    removeResultsPerPage() {
        var tf = this.tf;
        if (!tf.isInitialized() || !this.resultsPerPageSlc ||
            !this.resultsPerPage) {
            return;
        }
        if (this.resultsPerPageSlc) {
            removeElm(this.resultsPerPageSlc);
        }
        if (this.slcResultsTxt) {
            removeElm(this.slcResultsTxt);
        }
        this.resultsPerPageSlc = null;
        this.slcResultsTxt = null;
    }

    /**
     * Change the page based on passed index
     * @param {Number} index Index of the page (0-n)
     */
    changePage(index) {
        var tf = this.tf;

        if (!this.isEnabled()) {
            return;
        }

        this.emitter.emit('before-page-change', tf, (index + 1));

        if (index === null) {
            index = this.pageSelectorType === SELECT ?
                this.pagingSlc.options.selectedIndex : this.pagingSlc.value - 1;
        }
        if (index >= 0 && index <= (this.nbPages - 1)) {
            this.onBeforeChangePage(this, (index + 1));

            this.currentPageNb = parseInt(index, 10) + 1;
            if (this.pageSelectorType === SELECT) {
                this.pagingSlc.options[index].selected = true;
            } else {
                this.pagingSlc.value = this.currentPageNb;
            }

            this.startPagingRow = (this.pageSelectorType === SELECT) ?
                this.pagingSlc.value : (index * this.pagingLength);

            this.groupByPage();

            this.onAfterChangePage(this, (index + 1));
        }

        this.emitter.emit('after-page-change', tf, (index + 1));
    }

    /**
     * Change the number of results per page based on passed value
     * @param {String} val The number of results per page
     */
    changeResultsPerPage(val) {
        if (!this.isEnabled() || isNaN(val)) {
            return;
        }

        this.resultsPerPageSlc.value = val;
        this.onChangeResultsPerPage();
    }

    /**
     * Change rows according to page results drop-down
     */
    onChangeResultsPerPage() {
        var tf = this.tf;

        if (!this.isEnabled()) {
            return;
        }

        this.emitter.emit('before-page-length-change', tf);

        var slcR = this.resultsPerPageSlc;
        var slcIndex = slcR.selectedIndex;
        var slcPagesSelIndex = (this.pageSelectorType === SELECT) ?
            this.pagingSlc.selectedIndex :
            parseInt(this.pagingSlc.value - 1, 10);
        this.pagingLength = parseInt(slcR.options[slcIndex].value, 10);
        this.startPagingRow = this.pagingLength * slcPagesSelIndex;

        if (!isNaN(this.pagingLength)) {
            if (this.startPagingRow >= tf.nbFilterableRows) {
                this.startPagingRow = (tf.nbFilterableRows - this.pagingLength);
            }
            this.setPagingInfo();

            if (this.pageSelectorType === SELECT) {
                var slcIdx =
                    (this.pagingSlc.options.length - 1 <= slcPagesSelIndex) ?
                        (this.pagingSlc.options.length - 1) : slcPagesSelIndex;
                this.pagingSlc.options[slcIdx].selected = true;
            }
        }

        this.emitter.emit('after-page-length-change', tf, this.pagingLength);
    }

    /**
     * Re-set page nb at page re-load
     */
    resetPage() {
        var tf = this.tf;
        if (!this.isEnabled()) {
            return;
        }
        this.emitter.emit('before-reset-page', tf);
        var pgNb = tf.feature('store').getPageNb();
        if (pgNb !== '') {
            this.changePage((pgNb - 1));
        }
        this.emitter.emit('after-reset-page', tf, pgNb);
    }

    /**
     * Re-set page length value at page re-load
     */
    resetPageLength() {
        var tf = this.tf;
        if (!this.isEnabled()) {
            return;
        }
        this.emitter.emit('before-reset-page-length', tf);
        var pglenIndex = tf.feature('store').getPageLength();

        if (pglenIndex !== '') {
            this.resultsPerPageSlc.options[pglenIndex].selected = true;
            this.changeResultsPerPage();
        }
        this.emitter.emit('after-reset-page-length', tf, pglenIndex);
    }

    /**
     * Remove paging feature
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        var evt = this.evt;

        if (this.pagingSlc) {
            if (this.pageSelectorType === SELECT) {
                removeEvt(this.pagingSlc, 'change', evt.slcPagesChange);
            }
            else if (this.pageSelectorType === INPUT) {
                removeEvt(this.pagingSlc, 'keypress', evt._detectKey);
            }
            removeElm(this.pagingSlc);
        }

        if (this.btnNextCont) {
            removeEvt(this.btnNextCont, 'click', evt.next);
            removeElm(this.btnNextCont);
            this.btnNextCont = null;
        }

        if (this.btnPrevCont) {
            removeEvt(this.btnPrevCont, 'click', evt.prev);
            removeElm(this.btnPrevCont);
            this.btnPrevCont = null;
        }

        if (this.btnLastCont) {
            removeEvt(this.btnLastCont, 'click', evt.last);
            removeElm(this.btnLastCont);
            this.btnLastCont = null;
        }

        if (this.btnFirstCont) {
            removeEvt(this.btnFirstCont, 'click', evt.first);
            removeElm(this.btnFirstCont);
            this.btnFirstCont = null;
        }

        if (this.pgBefore) {
            removeElm(this.pgBefore);
            this.pgBefore = null;
        }

        if (this.pgAfter) {
            removeElm(this.pgAfter);
            this.pgAfter = null;
        }

        if (this.pgCont) {
            removeElm(this.pgCont);
            this.pgCont = null;
        }

        if (this.hasResultsPerPage) {
            this.removeResultsPerPage();
        }

        this.emitter.off(['after-filtering'], () => this.resetPagingInfo());
        this.emitter.off(['change-page'],
            (tf, pageNumber) => this.setPage(pageNumber));
        this.emitter.off(['change-page-results'],
            (tf, pageLength) => this.changeResultsPerPage(pageLength));

        this.pagingSlc = null;
        this.nbPages = 0;
        this.disable();
        this.initialized = false;
    }
}
