import {Feature} from '../../feature';
import {tag} from '../../dom';
import {INPUT} from '../../const';
import {root} from '../../root';

const INSTANTIATION_ERROR = `Failed to instantiate EditTable object.
    \n"ezEditTable" dependency not found.`;

/**
 * Adapter module for ezEditTable, an external library providing advanced
 * grid features (selection and edition):
 * http://codecanyon.net/item/ezedittable-enhance-html-tables/2425123?ref=koalyptus
 */
export default class AdapterEzEditTable extends Feature {

    /**
     * Creates an instance of AdapterEzEditTable
     *
     * @param {TableFilter} tf TableFilter instance
     * @param {Object} cfg Configuration options for ezEditTable library
     */
    constructor(tf, cfg) {
        super(tf, cfg.name);

        /**
         * Module description
         * @type {String}
         */
        this.desc = cfg.description || 'ezEditTable adapter';

        /**
         * Filename of ezEditTable library
         * @type {String}
         */
        this.filename = cfg.filename || 'ezEditTable.js';

        /**
         * Path to ezEditTable library
         * @type {String}
         */
        this.vendorPath = cfg.vendor_path;

        /**
         * Load ezEditTable stylesheet
         * @type {Boolean}
         */
        this.loadStylesheet = Boolean(cfg.load_stylesheet);

        /**
         * Path to ezEditTable stylesheet
         * @type {String}
         */
        this.stylesheet = cfg.stylesheet || this.vendorPath + 'ezEditTable.css';

        /**
         * Name of ezEditTable stylesheet
         * @type {String}
         */
        this.stylesheetName = cfg.stylesheet_name || 'ezEditTableCss';

        // Enable the ezEditTable's scroll into view behaviour if grid layout on
        cfg.scroll_into_view = cfg.scroll_into_view === false ?
            false : tf.gridLayout;

        /**
         * ezEditTable instance
         * @type {EditTable}
         * @private
         */
        this._ezEditTable = null;

        /**
         * ezEditTable configuration
         * @private
         */
        this.cfg = cfg;

        this.enable();
    }

    /**
     * Conditionally load ezEditTable library and set advanced grid
     */
    init() {
        if (this.initialized) {
            return;
        }
        let tf = this.tf;
        if (root.EditTable) {
            this._setAdvancedGrid();
        } else {
            let path = this.vendorPath + this.filename;
            tf.import(this.filename, path, () => this._setAdvancedGrid());
        }
        if (this.loadStylesheet && !tf.isImported(this.stylesheet, 'link')) {
            tf.import(this.stylesheetName, this.stylesheet, null, 'link');
        }

        // TODO: hack to prevent ezEditTable enter key event hijaking.
        // Needs to be fixed in the vendor's library
        this.emitter.on(['filter-focus', 'filter-blur'],
            () => this._toggleForInputFilter());

        /**
         * @inherited
         */
        this.initialized = true;
    }

    /**
     * Instantiate ezEditTable component for advanced grid features
     * @private
     */
    _setAdvancedGrid() {
        let tf = this.tf;

        //start row for EditTable constructor needs to be calculated
        let startRow,
            cfg = this.cfg,
            thead = tag(tf.tbl, 'thead');

        //if thead exists and startRow not specified, startRow is calculated
        //automatically by EditTable
        if (thead.length > 0 && !cfg.startRow) {
            startRow = undefined;
        }
        //otherwise startRow config property if any or TableFilter refRow
        else {
            startRow = cfg.startRow || tf.refRow;
        }

        cfg.base_path = cfg.base_path || tf.basePath + 'ezEditTable/';
        let editable = cfg.editable;
        let selectable = cfg.selection;

        if (selectable) {
            cfg.default_selection = cfg.default_selection || 'row';
        }
        //CSS Styles
        cfg.active_cell_css = cfg.active_cell_css || 'ezETSelectedCell';

        let _lastValidRowIndex = 0;
        let _lastRowIndex = 0;

        if (selectable) {
            //Row navigation needs to be calculated according to TableFilter's
            //validRowsIndex array
            let onAfterSelection = function (et, selectedElm, e) {
                let slc = et.Selection;
                //Next valid filtered row needs to be selected
                let doSelect = function (nextRowIndex) {
                    if (et.defaultSelection === 'row') {
                        /* eslint-disable */
                        slc.SelectRowByIndex(nextRowIndex);
                        /* eslint-enable */
                    } else {
                        /* eslint-disable */
                        et.ClearSelections();
                        /* eslint-enable */
                        let cellIndex = selectedElm.cellIndex,
                            row = tf.tbl.rows[nextRowIndex];
                        if (et.defaultSelection === 'both') {
                            /* eslint-disable */
                            slc.SelectRowByIndex(nextRowIndex);
                            /* eslint-enable */
                        }
                        if (row) {
                            /* eslint-disable */
                            slc.SelectCell(row.cells[cellIndex]);
                            /* eslint-enable */
                        }
                    }
                    //Table is filtered
                    if (tf.validRowsIndex.length !== tf.getRowsNb()) {
                        let r = tf.tbl.rows[nextRowIndex];
                        if (r) {
                            r.scrollIntoView(false);
                        }
                        if (cell) {
                            if (cell.cellIndex === (tf.getCellsNb() - 1) &&
                                tf.gridLayout) {
                                tf.tblCont.scrollLeft = 100000000;
                            }
                            else if (cell.cellIndex === 0 && tf.gridLayout) {
                                tf.tblCont.scrollLeft = 0;
                            } else {
                                cell.scrollIntoView(false);
                            }
                        }
                    }
                };

                //table is not filtered
                if (!tf.validRowsIndex) {
                    return;
                }
                let validIndexes = tf.validRowsIndex,
                    validIdxLen = validIndexes.length,
                    row = et.defaultSelection !== 'row' ?
                        selectedElm.parentNode : selectedElm,
                    //cell for default_selection = 'both' or 'cell'
                    cell = selectedElm.nodeName === 'TD' ? selectedElm : null,
                    /* eslint-disable */
                    keyCode = e !== undefined ? et.Event.GetKey(e) : 0,
                    /* eslint-enable */
                    isRowValid = validIndexes.indexOf(row.rowIndex) !== -1,
                    nextRowIndex,
                    paging = tf.feature('paging'),
                    //pgup/pgdown keys
                    d = keyCode === 34 || keyCode === 33 ?
                        (paging && paging.pagingLength || et.nbRowsPerPage) :
                        1;

                //If next row is not valid, next valid filtered row needs to be
                //calculated
                if (!isRowValid) {
                    //Selection direction up/down
                    if (row.rowIndex > _lastRowIndex) {
                        //last row
                        if (row.rowIndex >= validIndexes[validIdxLen - 1]) {
                            nextRowIndex = validIndexes[validIdxLen - 1];
                        } else {
                            let calcRowIndex = (_lastValidRowIndex + d);
                            if (calcRowIndex > (validIdxLen - 1)) {
                                nextRowIndex = validIndexes[validIdxLen - 1];
                            } else {
                                nextRowIndex = validIndexes[calcRowIndex];
                            }
                        }
                    } else {
                        //first row
                        if (row.rowIndex <= validIndexes[0]) {
                            nextRowIndex = validIndexes[0];
                        } else {
                            let v = validIndexes[_lastValidRowIndex - d];
                            nextRowIndex = v ? v : validIndexes[0];
                        }
                    }
                    _lastRowIndex = row.rowIndex;
                    doSelect(nextRowIndex);
                } else {
                    //If filtered row is valid, special calculation for
                    //pgup/pgdown keys
                    if (keyCode !== 34 && keyCode !== 33) {
                        _lastValidRowIndex = validIndexes.indexOf(row.rowIndex);
                        _lastRowIndex = row.rowIndex;
                    } else {
                        if (keyCode === 34) { //pgdown
                            //last row
                            if ((_lastValidRowIndex + d) <= (validIdxLen - 1)) {
                                nextRowIndex = validIndexes[
                                    _lastValidRowIndex + d];
                            } else {
                                nextRowIndex = [validIdxLen - 1];
                            }
                        } else { //pgup
                            //first row
                            if ((_lastValidRowIndex - d) <= validIndexes[0]) {
                                nextRowIndex = validIndexes[0];
                            } else {
                                nextRowIndex = validIndexes[
                                    _lastValidRowIndex - d];
                            }
                        }
                        _lastRowIndex = nextRowIndex;
                        _lastValidRowIndex = validIndexes.indexOf(nextRowIndex);
                        doSelect(nextRowIndex);
                    }
                }
            };

            //Page navigation has to be enforced whenever selected row is out of
            //the current page range
            let onBeforeSelection = function (et, selectedElm) {
                let row = et.defaultSelection !== 'row' ?
                    selectedElm.parentNode : selectedElm;
                if (tf.paging) {
                    if (tf.feature('paging').nbPages > 1) {
                        let paging = tf.feature('paging');
                        //page length is re-assigned in case it has changed
                        et.nbRowsPerPage = paging.pagingLength;
                        let validIndexes = tf.validRowsIndex,
                            validIdxLen = validIndexes.length,
                            pagingEndRow = parseInt(paging.startPagingRow, 10) +
                                parseInt(paging.pagingLength, 10);
                        let rowIndex = row.rowIndex;

                        if ((rowIndex === validIndexes[validIdxLen - 1]) &&
                            paging.currentPageNb !== paging.nbPages) {
                            paging.setPage('last');
                        }
                        else if ((rowIndex === validIndexes[0]) &&
                            paging.currentPageNb !== 1) {
                            paging.setPage('first');
                        }
                        else if (rowIndex > validIndexes[pagingEndRow - 1] &&
                            rowIndex < validIndexes[validIdxLen - 1]) {
                            paging.setPage('next');
                        }
                        else if (
                            rowIndex < validIndexes[paging.startPagingRow] &&
                            rowIndex > validIndexes[0]) {
                            paging.setPage('previous');
                        }
                    }
                }
            };

            //Selected row needs to be visible when paging is activated
            if (tf.paging) {
                tf.feature('paging').onAfterChangePage = function (paging) {
                    let advGrid = paging.tf.extension('advancedGrid');
                    let et = advGrid._ezEditTable;
                    let slc = et.Selection;
                    /* eslint-disable */
                    let row = slc.GetActiveRow();
                    /* eslint-enable */
                    if (row) {
                        row.scrollIntoView(false);
                    }
                    /* eslint-disable */
                    let cell = slc.GetActiveCell();
                    /* eslint-enable */
                    if (cell) {
                        cell.scrollIntoView(false);
                    }
                };
            }

            //Rows navigation when rows are filtered is performed with the
            //EditTable row selection callback events
            if (cfg.default_selection === 'row') {
                let fnB = cfg.on_before_selected_row;
                cfg.on_before_selected_row = function () {
                    var args = arguments;
                    onBeforeSelection(args[0], args[1], args[2]);
                    if (fnB) {
                        fnB.call(null, args[0], args[1], args[2]);
                    }
                };
                let fnA = cfg.on_after_selected_row;
                cfg.on_after_selected_row = function () {
                    var args = arguments;
                    onAfterSelection(args[0], args[1], args[2]);
                    if (fnA) {
                        fnA.call(null, args[0], args[1], args[2]);
                    }
                };
            } else {
                let fnD = cfg.on_before_selected_cell;
                cfg.on_before_selected_cell = function () {
                    var args = arguments;
                    onBeforeSelection(args[0], args[1], args[2]);
                    if (fnD) {
                        fnD.call(null, args[0], args[1], args[2]);
                    }
                };
                let fnC = cfg.on_after_selected_cell;
                cfg.on_after_selected_cell = function () {
                    var args = arguments;
                    onAfterSelection(args[0], args[1], args[2]);
                    if (fnC) {
                        fnC.call(null, args[0], args[1], args[2]);
                    }
                };
            }
        }
        if (editable) {
            //Added or removed rows, TF rows number needs to be re-calculated
            let fnE = cfg.on_added_dom_row;
            cfg.on_added_dom_row = function () {
                var args = arguments;
                tf.nbFilterableRows++;
                if (!tf.paging) {
                    tf.emitter.emit('rows-changed', tf, this);
                } else {
                    tf.nbFilterableRows++;
                    tf.paging = false;
                    tf.feature('paging').destroy();
                    tf.feature('paging').reset();
                }
                if (tf.alternateRows) {
                    tf.feature('alternateRows').init();
                }
                if (fnE) {
                    fnE.call(null, args[0], args[1], args[2]);
                }
            };
            if (cfg.actions && cfg.actions['delete']) {
                let fnF = cfg.actions['delete'].on_after_submit;
                cfg.actions['delete'].on_after_submit = function () {
                    var args = arguments;
                    tf.nbFilterableRows--;
                    if (!tf.paging) {
                        tf.emitter.emit('rows-changed', tf, this);
                    } else {
                        tf.nbFilterableRows--;
                        tf.paging = false;
                        tf.feature('paging').destroy();
                        tf.feature('paging').reset(false);
                    }
                    if (tf.alternateRows) {
                        tf.feature('alternateRows').init();
                    }
                    if (fnF) {
                        fnF.call(null, args[0], args[1]);
                    }
                };
            }
        }

        try {
            /* eslint-disable */
            this._ezEditTable = new EditTable(tf.id, cfg, startRow);
            this._ezEditTable.Init();
            /* eslint-enable */
        } catch (e) { throw new Error(INSTANTIATION_ERROR); }

        this.initialized = true;
    }

    /**
     * Reset advanced grid when previously removed
     */
    reset() {
        let ezEditTable = this._ezEditTable;
        if (ezEditTable) {
            if (this.cfg.selection) {
                /* eslint-disable */
                ezEditTable.Selection.Set();
                /* eslint-enable */
            }
            if (this.cfg.editable) {
                /* eslint-disable */
                ezEditTable.Editable.Set();
                /* eslint-enable */
            }
        }
    }

    /**
     * Toggle behaviour
     */
    toggle() {
        let ezEditTable = this._ezEditTable;
        if (ezEditTable.editable) {
            /* eslint-disable */
            ezEditTable.Editable.Remove();
            /* eslint-enable */
        } else {
            /* eslint-disable */
            ezEditTable.Editable.Set();
            /* eslint-enable */
        }
        if (ezEditTable.selection) {
            /* eslint-disable */
            ezEditTable.Selection.Remove();
            /* eslint-enable */
        } else {
            /* eslint-disable */
            ezEditTable.Selection.Set();
            /* eslint-enable */
        }
    }

    _toggleForInputFilter() {
        let tf = this.tf;
        if (!tf.getActiveFilterId()) {
            return;
        }
        let colIndex = tf.getColumnIndexFromFilterId(tf.getActiveFilterId());
        let filterType = tf.getFilterType(colIndex);
        if (filterType === INPUT) {
            this.toggle();
        }
    }

    /**
     * Remove advanced grid
     */
    destroy() {
        if (!this.initialized) {
            return;
        }
        let ezEditTable = this._ezEditTable;
        if (ezEditTable) {
            if (this.cfg.selection) {
                /* eslint-disable */
                ezEditTable.Selection.ClearSelections();
                ezEditTable.Selection.Remove();
                /* eslint-enable */
            }
            if (this.cfg.editable) {
                /* eslint-disable */
                ezEditTable.Editable.Remove();
                /* eslint-enable */
            }
        }

        this.emitter.off(['filter-focus', 'filter-blur'],
            () => this._toggleForInputFilter());
        this.initialized = false;
    }
}
