import {Feature} from '../../feature';
import {createText, elm} from '../../dom';
import {isArray, isFn, isUndef, isEmpty, EMPTY_FN} from '../../types';
import {numSortAsc} from '../../sort';

const EVENTS = [
    'after-filtering',
    'after-page-change',
    'after-page-length-change'
];

const SUM = 'sum';
const MEAN = 'mean';
const MIN = 'min';
const MAX = 'max';
const MEDIAN = 'median';
const Q1 = 'q1';
const Q3 = 'q3';

/**
 * Column calculations extension
 */
export default class ColOps extends Feature {

    /**
     * Creates an instance of ColOps
     *
     * @param {TableFilter} tf TableFilter instance
     * @param {Object} opts Configuration object
     */
    constructor(tf, opts) {
        super(tf, opts.name);

        /**
         * Callback fired before columns operations start
         * @type {Function}
         */
        this.onBeforeOperation = isFn(opts.on_before_operation) ?
            opts.on_before_operation : EMPTY_FN;

        /**
         * Callback fired after columns operations are completed
         * @type {Function}
         */
        this.onAfterOperation = isFn(opts.on_after_operation) ?
            opts.on_after_operation : EMPTY_FN;

        /**
         * Configuration options
         * @type {Object}
         */
        this.opts = opts;

        /**
         * List of DOM element IDs containing column's calculation result
         * @type {Array}
         */
        this.labelIds = opts.id || [];

        /**
         * List of columns' indexes for calculations
         * @type {Array}
         */
        this.colIndexes = opts.col || [];

        /**
         * List of operations - possible values: 'sum', 'mean', 'min', 'max',
         * 'median', 'q1', 'q3'
         * @type {Array}
         */
        this.operations = opts.operation || [];

        /**
         * List of write methods used to write the result - possible values:
         * 'innerHTML', 'setValue', 'createTextNode'
         * @type {Array}
         */
        this.outputTypes = opts.write_method || [];

        /**
         * List of row indexes displaying the results
         * @type {Array}
         */
        this.totRowIndexes = opts.tot_row_index || [];

        /**
         * List of row indexes excluded from calculations
         * @type {Array}
         */
        this.excludeRows = opts.exclude_row || [];

        /**
         * List of decimal precision for calculation results
         * @type {Array}
         */
        this.decimalPrecisions = isUndef(opts.decimal_precision) ?
                2 : opts.decimal_precision;

        this.enable();
    }

    /**
     * Initializes ColOps instance
     */
    init() {
        if (this.initialized) {
            return;
        }
        // subscribe to events
        this.emitter.on(EVENTS, () => this.calcAll());

        this.calcAll();

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Calculates columns' values
     * Configuration options are stored in 'opts' property
     * - 'id' contains ids of elements showing result (array)
     * - 'col' contains the columns' indexes (array)
     * - 'operation' contains operation type (array, values: 'sum', 'mean',
     *   'min', 'max', 'median', 'q1', 'q3')
     * - 'write_method' array defines which method to use for displaying the
     *    result (innerHTML, setValue, createTextNode) - default: 'innerHTML'
     * - 'tot_row_index' defines in which row results are displayed
     *   (integers array)
     *
     * - changes made by Nuovella:
     * (1) optimized the routine (now it will only process each column once),
     * (2) added calculations for the median, lower and upper quartile.
     */
    calcAll() {
        let tf = this.tf;
        if (!tf.isInitialized()) {
            return;
        }

        this.onBeforeOperation(tf, this);
        this.emitter.emit('before-column-operation', tf, this);

        let colIndexes = this.colIndexes,
            colOperations = this.operations,
            outputTypes = this.outputTypes,
            totRowIndexes = this.totRowIndexes,
            excludeRows = this.excludeRows,
            decimalPrecisions = isUndef(this.decimalPrecisions) ?
                2 : this.decimalPrecisions;

        //nuovella: determine unique list of columns to operate on
        let uIndexes = [];
        colIndexes.forEach((val) => {
            if (uIndexes.indexOf(val) === -1) {
                uIndexes.push(val);
            }
        });

        let nbCols = uIndexes.length,
            rows = tf.tbl.rows,
            colValues = [];

        for (let u = 0; u < nbCols; u++) {
            //this retrieves col values
            //use uIndexes because we only want to pass through this loop
            //once for each column get the values in this unique column
            colValues.push(
                tf.getFilteredDataCol(uIndexes[u], false, true, excludeRows)
            );

            let curValues = colValues[u];

            //next: calculate all operations for this column
            let result = 0,
                operations = [],
                precisions = [],
                labels = [],
                writeType,
                idx = 0;

            for (let k = 0; k < colIndexes.length; k++) {
                if (colIndexes[k] !== uIndexes[u]) {
                    continue;
                }
                operations[idx] = (colOperations[k] || 'sum').toLowerCase();
                precisions[idx] = decimalPrecisions[k];
                labels[idx] = this.labelIds[k];
                writeType = isArray(outputTypes) ? outputTypes[k] : null;
                idx++;
            }

            for (let i = 0; i < idx; i++) {
                // emit values before column calculation
                this.emitter.emit(
                    'before-column-calc',
                    tf,
                    this,
                    uIndexes[u],
                    curValues,
                    operations[i],
                    precisions[i]
                );

                result = Number(this.calc(curValues, operations[i], null));

                // emit column calculation result
                this.emitter.emit(
                    'column-calc',
                    tf,
                    this,
                    uIndexes[u],
                    result,
                    operations[i],
                    precisions[i]
                );

                // write result in expected DOM element
                this.writeResult(
                    result,
                    labels[i],
                    writeType,
                    precisions[i]
                );

            }//for i

            // row(s) with result are always visible
            let totRow = totRowIndexes && totRowIndexes[u] ?
                rows[totRowIndexes[u]] : null;
            if (totRow) {
                totRow.style.display = '';
            }
        }//for u

        this.onAfterOperation(tf, this);
        this.emitter.emit('after-column-operation', tf, this);
    }

    /**
     * Make desired calculation on specified column.
     * @param {Number} colIndex Column index
     * @param {String} [operation=SUM] Operation type
     * @param {Number} precision Decimal precision
     * @returns {Number}
     */
    columnCalc(colIndex, operation = SUM, precision) {
        let excludeRows = this.excludeRows || [];
        let colValues =
            this.tf.getFilteredDataCol(colIndex, false, true, excludeRows);
        return Number(this.calc(colValues, operation, precision));
    }

    /**
     * Make calculation on passed values.
     * @param {Array} values List of values
     * @param {String} [operation=SUM] Optional operation type
     * @param {Number} precision Optional result precision
     * @returns {Number}
     * @private
     */
    calc(colValues, operation = SUM, precision) {
        let result = 0;

        if (operation === Q1 || operation === Q3 || operation === MEDIAN) {
            colValues = this.sortColumnValues(colValues, numSortAsc);
        }

        switch (operation) {
            case MEAN:
                result = this.calcMean(colValues);
                break;
            case SUM:
                result = this.calcSum(colValues);
                break;
            case MIN:
                result = this.calcMin(colValues);
                break;
            case MAX:
                result = this.calcMax(colValues);
                break;
            case MEDIAN:
                result = this.calcMedian(colValues);
                break;
            case Q1:
                result = this.calcQ1(colValues);
                break;
            case Q3:
                result = this.calcQ3(colValues);
                break;
        }

        return isEmpty(precision) ? result : result.toFixed(precision);
    }

    /**
     * Calculate the sum of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcSum(values = []) {
        if (isEmpty(values)) {
            return 0;
        }
        let result = values.reduce((x, y) => Number(x) + Number(y));
        return result;
    }

    /**
     * Calculate the mean of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcMean(values = []) {
        let result = this.calcSum(values) / values.length;
        return Number(result);
    }

    /**
     * Calculate the max value of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcMax(values = []) {
        return Math.max.apply(null, values);
    }

    /**
     * Calculate the min value of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcMin(values = []) {
        return Math.min.apply(null, values);
    }

    /**
     * Calculate the median of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcMedian(values = []) {
        let nbValues = values.length;
        let aux = 0;
        if (nbValues % 2 === 1) {
            aux = Math.floor(nbValues / 2);
            return Number(values[aux]);
        }
        return (Number(values[nbValues / 2]) +
            Number(values[((nbValues / 2) - 1)])) / 2;
    }

    /**
     * Calculate the lower quartile of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcQ1(values = []) {
        let nbValues = values.length;
        let posa = 0.0;
        posa = Math.floor(nbValues / 4);
        if (4 * posa === nbValues) {
            return (Number(values[posa - 1]) +
                Number(values[posa])) / 2;
        }
        return Number(values[posa]);
    }

    /**
     * Calculate the upper quartile of passed values.
     * @param {Array} [values=[]] List of values
     * @returns {Number}
     */
    calcQ3(values = []) {
        let nbValues = values.length;
        let posa = 0.0;
        let posb = 0.0;
        posa = Math.floor(nbValues / 4);
        if (4 * posa === nbValues) {
            posb = 3 * posa;
            return (Number(values[posb]) +
                Number(values[posb - 1])) / 2;
        }
        return Number(values[nbValues - posa - 1]);
    }

    /**
     * Sort passed values with supplied sorter function.
     * @param {Array} [values=[]] List of values to be sorted
     * @param {Function} sorter Sorter function
     * @returns {Array}
     */
    sortColumnValues(values = [], sorter) {
        return values.sort(sorter);
    }

    /**
     * Write calculation result in passed DOM element with supplied write method
     * and decimal precision.
     * @param {Number} [result=0] Calculation result
     * @param {DOMElement} label DOM element
     * @param {String} [writeType='innerhtml'] Write method
     * @param {Number} [precision=2] Applied decimal precision
     * @private
     */
    writeResult(result = 0, label, writeType = 'innerhtml', precision = 2) {
        let labelElm = elm(label);

        if (!labelElm) {
            return;
        }

        result = result.toFixed(precision);
        if (isNaN(result) || !isFinite(result)) {
            result = '';
        }

        switch (writeType.toLowerCase()) {
            case 'innerhtml':
                labelElm.innerHTML = result;
                break;
            case 'setvalue':
                labelElm.value = result;
                break;
            case 'createtextnode':
                let oldNode = labelElm.firstChild;
                let txtNode = createText(result);
                labelElm.replaceChild(txtNode, oldNode);
                break;
        }
    }

    /** Remove extension */
    destroy() {
        if (!this.initialized) {
            return;
        }
        // unsubscribe to events
        this.emitter.off(EVENTS, () => this.calcAll());

        this.initialized = false;
    }

}
