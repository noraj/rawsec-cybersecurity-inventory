import {Feature} from '../feature';
import {createElm, removeElm, elm, tag} from '../dom';
import {addEvt, targetEvt} from '../event';
import {contains} from '../string';
import {NONE} from '../const';

/**
 * Grid layout, table with fixed headers
 */
export class GridLayout extends Feature {

    /**
     * Creates an instance of GridLayout
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'gridLayout');

        let f = this.config;

        /**
         * Grid-layout container width as CSS string
         * @type {String}
         */
        this.width = f.grid_width || null;

        /**
         * Grid-layout container height as CSS string
         * @type {String}
         */
        this.height = f.grid_height || null;

        /**
         * Css class for main container element
         * @type {String}
         */
        this.mainContCssClass = f.grid_cont_css_class || 'grd_Cont';

        /**
         * Css class for body table container element
         * @type {String}
         */
        this.contCssClass = f.grid_tbl_cont_css_class || 'grd_tblCont';

        /**
         * Css class for headers table container element
         * @type {String}
         */
        this.headContCssClass = f.grid_tblHead_cont_css_class ||
            'grd_headTblCont';

        /**
         * Css class for toolbar container element (rows counter, paging etc.)
         * @type {String}
         */
        this.infDivCssClass = f.grid_inf_grid_css_class || 'grd_inf';

        /**
         * Index of the headers row, default: 0
         * @type {Number}
         */
        this.headRowIndex = f.grid_headers_row_index || 0;

        /**
         * Collection of the header row indexes to be moved into headers table
         * @type {Array}
         */
        this.headRows = f.grid_headers_rows || [0];

        /**
         * Enable or disable column filters generation, default: true
         * @type {Boolean}
         */
        this.enableFilters = f.grid_enable_default_filters === false ?
            false : true;

        /**
         * Enable or disable column headers, default: false
         * @type {Boolean}
         */
        this.noHeaders = Boolean(f.grid_no_headers);

        /**
         * Grid-layout default column widht as CSS string
         * @type {String}
         */
        this.defaultColWidth = f.grid_default_col_width || '100px';

        /**
         * List of column elements
         * @type {Array}
         * @private
         */
        this.colElms = [];

        /**
         * Prefix for grid-layout filter's cell ID
         * @type {String}
         * @private
         */
        this.prfxGridFltTd = '_td_';

        /**
         * Prefix for grid-layout header's cell ID
         * @type {String}
         * @private
         */
        this.prfxGridTh = 'tblHeadTh_';

        /**
         * Mark-up of original HTML table
         * @type {String}
         * @private
         */
        this.sourceTblHtml = tf.tbl.outerHTML;

        /**
         * Indicates if working table has column elements
         * @type {Boolean}
         * @private
         */
        this.tblHasColTag = tag(tf.tbl, 'col').length > 0 ? true : false;

        /**
         * Main container element
         * @private
         */
        this.tblMainCont = null;

        /**
         * Table container element
         * @private
         */
        this.tblCont = null;

        /**
         * Headers' table container element
         * @private
         */
        this.headTblCont = null;

        /**
         * Headers' table element
         * @private
         */
        this.headTbl = null;

        // filters flag at TF level
        tf.fltGrid = this.enableFilters;
    }

    /**
     * Generates a grid with fixed headers
     * TODO: reduce size of init by extracting single purposed methods
     */
    init() {
        let tf = this.tf;
        let tbl = tf.tbl;

        if (this.initialized) {
            return;
        }

        // Override relevant TableFilter properties
        this.setOverrides();

        // Assign default column widths
        this.setDefaultColWidths();

        // Initial table width
        let tblW = this.initialTableWidth();

        //Main container: it will contain all the elements
        this.tblMainCont = this.createContainer(
            'div', this.mainContCssClass);
        if (this.width) {
            this.tblMainCont.style.width = this.width;
        }
        tbl.parentNode.insertBefore(this.tblMainCont, tbl);

        //Table container: div wrapping content table
        this.tblCont = this.createContainer('div', this.contCssClass);
        this.setConfigWidth(this.tblCont);
        if (this.height) {
            this.tblCont.style.height = this.height;
        }
        tbl.parentNode.insertBefore(this.tblCont, tbl);
        let t = removeElm(tbl);
        this.tblCont.appendChild(t);

        //In case table width is expressed in %
        if (tbl.style.width === '') {
            tbl.style.width = (contains('%', tblW) ?
                tbl.clientWidth : tblW) + 'px';
        }

        let d = removeElm(this.tblCont);
        this.tblMainCont.appendChild(d);

        //Headers table container: div wrapping headers table
        this.headTblCont = this.createContainer(
            'div', this.headContCssClass);
        this.setConfigWidth(this.headTblCont);

        //Headers table
        this.headTbl = createElm('table');
        let tH = createElm('tHead');

        //1st row should be headers row, ids are added if not set
        //Those ids are used by the sort feature
        let hRow = tbl.rows[this.headRowIndex];
        let sortTriggers = this.getSortTriggerIds(hRow);

        //Filters row is created
        let filtersRow = this.createFiltersRow();

        //Headers row are moved from content table to headers table
        this.setHeadersRow(tH);

        this.headTbl.appendChild(tH);
        if (tf.filtersRowIndex === 0) {
            tH.insertBefore(filtersRow, hRow);
        } else {
            tH.appendChild(filtersRow);
        }

        this.headTblCont.appendChild(this.headTbl);
        this.tblCont.parentNode.insertBefore(this.headTblCont, this.tblCont);

        //THead needs to be removed in content table for sort feature
        let thead = tag(tbl, 'thead');
        if (thead.length > 0) {
            tbl.removeChild(thead[0]);
        }

        //Headers table style
        this.headTbl.style.tableLayout = 'fixed';
        tbl.style.tableLayout = 'fixed';
        this.headTbl.cellPadding = tbl.cellPadding;
        this.headTbl.cellSpacing = tbl.cellSpacing;
        // this.headTbl.style.width = tbl.style.width;

        //content table without headers needs col widths to be reset
        tf.setColWidths(this.headTbl);

        //Headers container width
        // this.headTblCont.style.width = this.tblCont.clientWidth+'px';

        tbl.style.width = '';
        //
        this.headTbl.style.width = tbl.clientWidth + 'px';
        //

        //scroll synchronisation
        addEvt(this.tblCont, 'scroll', (evt) => {
            let elm = targetEvt(evt);
            let scrollLeft = elm.scrollLeft;
            this.headTblCont.scrollLeft = scrollLeft;
            //New pointerX calc taking into account scrollLeft
            // if(!o.isPointerXOverwritten){
            //     try{
            //         o.Evt.pointerX = function(evt){
            //             let e = evt || global.event;
            //             let bdScrollLeft = tf_StandardBody().scrollLeft +
            //                 scrollLeft;
            //             return (e.pageX + scrollLeft) ||
            //                 (e.clientX + bdScrollLeft);
            //         };
            //         o.isPointerXOverwritten = true;
            //     } catch(err) {
            //         o.isPointerXOverwritten = false;
            //     }
            // }
        });

        // TODO: Trigger a custom event handled by sort extension
        let sort = tf.extension('sort');
        if (sort) {
            sort.asyncSort = true;
            sort.triggerIds = sortTriggers;
        }

        //Col elements are enough to keep column widths after sorting and
        //filtering
        this.setColumnElements();

        if (tf.popupFilters) {
            filtersRow.style.display = NONE;
        }

        if (tbl.clientWidth !== this.headTbl.clientWidth) {
            tbl.style.width = this.headTbl.clientWidth + 'px';
        }

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Overrides TableFilter instance properties to adjust to grid layout mode
     * @private
     */
    setOverrides() {
        let tf = this.tf;
        tf.refRow = 0;
        tf.headersRow = 0;
        tf.filtersRowIndex = 1;
        tf.isExternalFlt = true;
    }

    /**
     * Set grid-layout default column widths if column widths are not defined
     * @private
     */
    setDefaultColWidths() {
        let tf = this.tf;
        if (tf.hasColWidths) {
            return;
        }
        for (let k = 0, len = tf.getCellsNb(); k < len; k++) {
            let colW;
            let cell = tf.tbl.rows[tf.getHeadersRowIndex()].cells[k];
            if (cell.width !== '') {
                colW = cell.width;
            } else if (cell.style.width !== '') {
                colW = parseInt(cell.style.width, 10);
            } else {
                colW = this.defaultColWidth;
            }
            tf.colWidths[k] = colW;
        }
        tf.hasColWidths = true;
        tf.setColWidths();
    }

    /**
     * Initial table width
     * @returns {Number}
     * @private
     */
    initialTableWidth() {
        let tbl = this.tf.tbl;
        let width; //initial table width

        if (tbl.width !== '') {
            width = tbl.width;
        }
        else if (tbl.style.width !== '') {
            width = tbl.style.width;
        } else {
            width = tbl.clientWidth;
        }
        return parseInt(width, 10);
    }

    /**
     * Creates container element
     * @param {String} tag Tag name
     * @param {String} className Css class to assign to element
     * @returns {DOMElement}
     * @private
     */
    createContainer(tag, className) {
        let element = createElm(tag);
        element.className = className;
        return element;
    }

    /**
     * Creates filters row with cells
     * @returns {HTMLTableRowElement}
     * @private
     */
    createFiltersRow() {
        let tf = this.tf;
        let filtersRow = createElm('tr');
        if (this.enableFilters && tf.fltGrid) {
            tf.externalFltTgtIds = [];
            for (let j = 0; j < tf.getCellsNb(); j++) {
                let fltTdId = `${tf.prfxFlt + j + this.prfxGridFltTd + tf.id}`;
                let cl = createElm(tf.fltCellTag, ['id', fltTdId]);
                filtersRow.appendChild(cl);
                tf.externalFltTgtIds[j] = fltTdId;
            }
        }
        return filtersRow;
    }

    /**
     * Generates column elements if necessary and assigns their widths
     * @private
     */
    setColumnElements() {
        let tf = this.tf;
        let cols = tag(tf.tbl, 'col');
        this.tblHasColTag = cols.length > 0;

        for (let k = (tf.nbCells - 1); k >= 0; k--) {
            let col;

            if (!this.tblHasColTag) {
                col = createElm('col');
                tf.tbl.insertBefore(col, tf.tbl.firstChild);
            } else {
                col = cols[k];
            }
            col.style.width = tf.colWidths[k];
            this.colElms[k] = col;
        }
        this.tblHasColTag = true;
    }

    /**
     * Sets headers row in headers table
     * @param {HTMLHeadElement} tableHead Table head element
     * @private
     */
    setHeadersRow(tableHead) {
        if (this.noHeaders) {
            // Handle table with no headers, assuming here headers do not
            // exist
            tableHead.appendChild(createElm('tr'));
        } else {
            // Headers row are moved from content table to headers table
            for (let i = 0; i < this.headRows.length; i++) {
                let row = this.tf.tbl.rows[this.headRows[i]];
                tableHead.appendChild(row);
            }
        }
    }

    /**
     * Sets width defined in configuration to passed element
     * @param {DOMElement} element DOM element
     * @private
     */
    setConfigWidth(element) {
        if (!this.width) {
            return;
        }
        if (this.width.indexOf('%') !== -1) {
            element.style.width = '100%';
        } else {
            element.style.width = this.width;
        }
    }

    /**
     * Returns a list of header IDs used for specifing external sort triggers
     * @param {HTMLTableRowElement} row DOM row element
     * @returns {Array} List of IDs
     * @private
     */
    getSortTriggerIds(row) {
        let tf = this.tf;
        let sortTriggers = [];
        for (let n = 0; n < tf.getCellsNb(); n++) {
            let c = row.cells[n];
            let thId = c.getAttribute('id');
            if (!thId || thId === '') {
                thId = `${this.prfxGridTh + n}_${tf.id}`;
                c.setAttribute('id', thId);
            }
            sortTriggers.push(thId);
        }
        return sortTriggers;
    }

    /**
     * Removes the grid layout
     */
    destroy() {
        let tf = this.tf;
        let tbl = tf.tbl;

        if (!this.initialized) {
            return;
        }
        let t = removeElm(tbl);
        this.tblMainCont.parentNode.insertBefore(t, this.tblMainCont);
        removeElm(this.tblMainCont);

        this.tblMainCont = null;
        this.headTblCont = null;
        this.headTbl = null;
        this.tblCont = null;

        tbl.outerHTML = this.sourceTblHtml;
        //needed to keep reference of table element for future usage
        this.tf.tbl = elm(tf.id);

        this.initialized = false;
    }
}
