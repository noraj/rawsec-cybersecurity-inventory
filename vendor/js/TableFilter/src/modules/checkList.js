import {Feature} from '../feature';
import {
    addClass, createCheckItem, createText, createElm, elm, getText,
    removeClass, tag
} from '../dom';
import {has} from '../array';
import {matchCase, trim, rgxEsc} from '../string';
import {ignoreCase, numSortAsc, numSortDesc} from '../sort';
import {addEvt, removeEvt, targetEvt} from '../event';
import {isEmpty} from '../types';
import {CHECKLIST, NONE} from '../const';

const SORT_ERROR = 'Filter options for column {0} cannot be sorted in ' +
    '{1} manner.';

/**
 * Checklist filter UI component
 */
export class CheckList extends Feature {

    /**
     * Creates an instance of CheckList
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'checkList');

        let f = this.config;

        /**
         * List of container DOM elements
         * @type {Array}
         */
        this.containers = [];

        /**
         * Css class for the container of the checklist filter (div)
         * @type {String}
         */
        this.containerCssClass = f.div_checklist_css_class || 'div_checklist';

        /**
         * Css class for the checklist filter element (ul)
         * @type {String}
         */
        this.filterCssClass = f.checklist_css_class || 'flt_checklist';

        /**
         * Css class for the item of a checklist (li)
         * @type {String}
         */
        this.itemCssClass = f.checklist_item_css_class || 'flt_checklist_item';

        /**
         * Css class for a selected item of a checklist (li)
         * @type {String}
         */
        this.selectedItemCssClass =
            f.checklist_selected_item_css_class || 'flt_checklist_slc_item';

        /**
         * Text placed in the filter's container when load filter on demand
         * feature is enabled
         * @type {String}
         */
        this.activateText =
            f.activate_checklist_text || 'Click to load filter data';

        /**
         * Css class for a disabled item of a checklist (li)
         * @type {String}
         */
        this.disabledItemCssClass = f.checklist_item_disabled_css_class ||
            'flt_checklist_item_disabled';

        /**
         * Enable the reset filter option as first item
         * @type {Boolean}
         */
        this.enableResetOption = f.enable_checklist_reset_filter === false ?
            false : true;

        /**
         * Prefix for container element ID
         * @type {String}
         * @private
         */
        this.prfx = 'chkdiv_';

        /**
         * Has custom options
         * @type {Boolean}
         * @private
         */
        this.isCustom = false;

        /**
         * List of options values
         * @type {Array}
         * @private
         */
        this.opts = [];

        /**
         * List of options texts for custom values
         * @type {Array}
         * @private
         */
        this.optsTxt = [];

        /**
         * List of options to be excluded from the checklist filter
         * @type {Array}
         * @private
         */
        this.excludedOpts = [];
    }

    /**
     * Checklist option click event handler
     * @param {Event} evt
     * @private
     */
    optionClick(evt) {
        let elm = targetEvt(evt);
        let tf = this.tf;

        this.emitter.emit('filter-focus', tf, elm);
        this.setCheckListValues(elm);
        tf.filter();
    }

    /**
     * Checklist container click event handler for load-on-demand feature
     * @param {Event} evt
     * @private
     */
    onCheckListClick(evt) {
        let elm = targetEvt(evt);
        if (this.tf.loadFltOnDemand && elm.getAttribute('filled') === '0') {
            let ct = elm.getAttribute('ct');
            let div = this.containers[ct];
            this.build(ct);
            removeEvt(div, 'click', (evt) => this.onCheckListClick(evt));
        }
    }

    /**
     * Refresh all checklist filters
     */
    refreshAll() {
        let tf = this.tf;
        let fltsIdxs = tf.getFiltersByType(CHECKLIST, true);
        fltsIdxs.forEach((colIdx) => {
            let values = this.getValues(colIdx);
            this.build(colIdx, tf.linkedFilters);
            this.selectOptions(colIdx, values);
        });
    }

    /**
     * Initialize checklist filter
     * @param  {Number}     colIndex   Column index
     * @param  {Boolean}    isExternal External filter flag
     * @param  {DOMElement} container  Dom element containing the filter
     */
    init(colIndex, isExternal, container) {
        let tf = this.tf;
        let externalFltTgtId = isExternal ?
            tf.externalFltTgtIds[colIndex] : null;

        let divCont = createElm('div',
            ['id', `${this.prfx}${colIndex}_${tf.id}`],
            ['ct', colIndex], ['filled', '0']);
        divCont.className = this.containerCssClass;

        //filter is appended in desired element
        if (externalFltTgtId) {
            elm(externalFltTgtId).appendChild(divCont);
        } else {
            container.appendChild(divCont);
        }

        this.containers[colIndex] = divCont;
        tf.fltIds.push(tf.buildFilterId(colIndex));

        if (!tf.loadFltOnDemand) {
            this.build(colIndex);
        } else {
            addEvt(divCont, 'click', (evt) => this.onCheckListClick(evt));
            divCont.appendChild(createText(this.activateText));
        }

        this.emitter.on(
            ['build-checklist-filter'],
            (tf, colIndex, isLinked) => this.build(colIndex, isLinked)
        );

        this.emitter.on(
            ['select-checklist-options'],
            (tf, colIndex, values) => this.selectOptions(colIndex, values)
        );

        this.emitter.on(['rows-changed'], () => this.refreshAll());

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Build checklist UI
     * @param  {Number}  colIndex   Column index
     * @param  {Boolean} isLinked    Enable linked filters behaviour
     */
    build(colIndex, isLinked = false) {
        let tf = this.tf;
        colIndex = parseInt(colIndex, 10);

        this.emitter.emit('before-populating-filter', tf, colIndex);

        this.opts = [];
        this.optsTxt = [];

        let flt = this.containers[colIndex];
        let ul = createElm('ul',
            ['id', tf.fltIds[colIndex]],
            ['colIndex', colIndex]);
        ul.className = this.filterCssClass;

        let rows = tf.tbl.rows;
        let nbRows = tf.getRowsNb(true);
        let caseSensitive = tf.caseSensitive;
        this.isCustom = tf.isCustomOptions(colIndex);

        let activeIdx;
        let activeFilterId = tf.getActiveFilterId();
        if (isLinked && activeFilterId) {
            activeIdx = tf.getColumnIndexFromFilterId(activeFilterId);
        }

        let filteredDataCol = [];
        if (isLinked && tf.disableExcludedOptions) {
            this.excludedOpts = [];
        }

        flt.innerHTML = '';

        for (let k = tf.refRow; k < nbRows; k++) {
            // always visible rows don't need to appear on selects as always
            // valid
            if (tf.hasVisibleRows && tf.visibleRows.indexOf(k) !== -1) {
                continue;
            }

            let cells = rows[k].cells;
            let ncells = cells.length;

            // checks if row has exact cell #
            if (ncells !== tf.nbCells || this.isCustom) {
                continue;
            }

            // this loop retrieves cell data
            for (let j = 0; j < ncells; j++) {
                if (colIndex !== j) {
                    continue;
                }
                if (isLinked && !tf.disableExcludedOptions &&
                    (!tf.paging && !tf.isRowDisplayed(k)) ||
                    (tf.paging && activeIdx && !tf.isRowValid(k))) {
                    continue;
                }

                let cellValue = tf.getCellValue(cells[j]);
                //Vary Peter's patch
                let cellString = matchCase(cellValue, caseSensitive);
                // checks if celldata is already in array
                if (!has(this.opts, cellString, caseSensitive)) {
                    this.opts.push(cellValue);
                }
                let filteredCol = filteredDataCol[j];
                if (isLinked && tf.disableExcludedOptions) {
                    if (!filteredCol) {
                        filteredCol = tf.getFilteredDataCol(j);
                    }
                    if (!has(filteredCol, cellString, caseSensitive) &&
                        !has(this.excludedOpts, cellString,
                            caseSensitive)) {
                        this.excludedOpts.push(cellValue);
                    }
                }
            }
        }

        //Retrieves custom values
        if (this.isCustom) {
            let customValues = tf.getCustomOptions(colIndex);
            this.opts = customValues[0];
            this.optsTxt = customValues[1];
        }

        if (tf.sortSlc && !this.isCustom) {
            if (!caseSensitive) {
                this.opts.sort(ignoreCase);
                if (this.excludedOpts) {
                    this.excludedOpts.sort(ignoreCase);
                }
            } else {
                this.opts.sort();
                if (this.excludedOpts) {
                    this.excludedOpts.sort();
                }
            }
        }
        //asc sort
        if (tf.sortNumAsc.indexOf(colIndex) !== -1) {
            try {
                this.opts.sort(numSortAsc);
                if (this.excludedOpts) {
                    this.excludedOpts.sort(numSortAsc);
                }
                if (this.isCustom) {
                    this.optsTxt.sort(numSortAsc);
                }
            } catch (e) {
                throw new Error(SORT_ERROR.replace('{0}', colIndex)
                    .replace('{1}', 'ascending'));
            }//in case there are alphanumeric values
        }
        //desc sort
        if (tf.sortNumDesc.indexOf(colIndex) !== -1) {
            try {
                this.opts.sort(numSortDesc);
                if (this.excludedOpts) {
                    this.excludedOpts.sort(numSortDesc);
                }
                if (this.isCustom) {
                    this.optsTxt.sort(numSortDesc);
                }
            } catch (e) {
                throw new Error(SORT_ERROR.replace('{0}', colIndex)
                    .replace('{1}', 'descending'));
            }//in case there are alphanumeric values
        }

        this.addChecks(colIndex, ul);

        if (tf.loadFltOnDemand) {
            flt.innerHTML = '';
        }
        flt.appendChild(ul);
        flt.setAttribute('filled', '1');

        this.emitter.emit('after-populating-filter', tf, colIndex, flt);
    }

    /**
     * Add checklist options
     * @param {Number} colIndex  Column index
     * @param {Object} ul        Ul element
     * @private
     */
    addChecks(colIndex, ul) {
        let tf = this.tf;
        let chkCt = this.addTChecks(colIndex, ul);

        for (let y = 0; y < this.opts.length; y++) {
            let val = this.opts[y]; //item value
            let lbl = this.isCustom ? this.optsTxt[y] : val; //item text
            let fltId = tf.fltIds[colIndex];
            let li = createCheckItem(`${fltId}_${(y + chkCt)}`, val, lbl);
            li.className = this.itemCssClass;

            if (tf.linkedFilters && tf.disableExcludedOptions &&
                has(this.excludedOpts, matchCase(val, tf.caseSensitive),
                    tf.caseSensitive)) {
                addClass(li, this.disabledItemCssClass);
                li.check.disabled = true;
                li.disabled = true;
            } else {
                addEvt(li.check, 'click', evt => this.optionClick(evt));
            }
            ul.appendChild(li);

            if (val === '') {
                //item is hidden
                li.style.display = NONE;
            }
        }
    }

    /**
     * Add checklist header option
     * @param {Number} colIndex Column index
     * @param {Object} ul       Ul element
     * @private
     */
    addTChecks(colIndex, ul) {
        let tf = this.tf;
        let chkCt = 1;
        let fltId = tf.fltIds[colIndex];
        let li0 = createCheckItem(`${fltId}_0`, '',
            tf.getClearFilterText(colIndex));
        li0.className = this.itemCssClass;
        ul.appendChild(li0);

        addEvt(li0.check, 'click', evt => this.optionClick(evt));

        if (!this.enableResetOption) {
            li0.style.display = NONE;
        }

        if (tf.enableEmptyOption) {
            let li1 = createCheckItem(`${fltId}_1`, tf.emOperator,
                tf.emptyText);
            li1.className = this.itemCssClass;
            ul.appendChild(li1);
            addEvt(li1.check, 'click', evt => this.optionClick(evt));
            chkCt++;
        }

        if (tf.enableNonEmptyOption) {
            let li2 = createCheckItem(`${fltId}_2`, tf.nmOperator,
                tf.nonEmptyText);
            li2.className = this.itemCssClass;
            ul.appendChild(li2);
            addEvt(li2.check, 'click', evt => this.optionClick(evt));
            chkCt++;
        }
        return chkCt;
    }

    /**
     * Store checked options in DOM element attribute
     * @param {Object} o checklist option DOM element
     * @private
     */
    setCheckListValues(o) {
        if (!o) {
            return;
        }

        let tf = this.tf;
        let chkValue = o.value; //checked item value
        // TODO: provide helper to extract column index, ugly!
        let chkIndex = parseInt(o.id.split('_')[2], 10);
        let colIdx = tf.getColumnIndexFromFilterId(o.id);
        let itemTag = 'LI';

        let n = tf.getFilterElement(parseInt(colIdx, 10));
        let li = n.childNodes[chkIndex];
        let colIndex = n.getAttribute('colIndex');
        let fltValue = n.getAttribute('value'); //filter value (ul tag)
        let fltIndexes = n.getAttribute('indexes'); //selected items (ul tag)

        if (o.checked) {
            //show all item
            if (chkValue === '') {
                if ((fltIndexes && fltIndexes !== '')) {
                    //items indexes
                    let indSplit = fltIndexes.split(tf.separator);
                    //checked items loop
                    for (let u = 0; u < indSplit.length; u++) {
                        //checked item
                        let cChk = elm(tf.fltIds[colIndex] + '_' +
                            indSplit[u]);
                        if (cChk) {
                            cChk.checked = false;
                            removeClass(n.childNodes[indSplit[u]],
                                this.selectedItemCssClass);
                        }
                    }
                }
                n.setAttribute('value', '');
                n.setAttribute('indexes', '');

            } else {
                fltValue = (fltValue) ? fltValue : '';
                chkValue = trim(fltValue + ' ' + chkValue + ' ' +
                    tf.orOperator);
                chkIndex = fltIndexes + chkIndex + tf.separator;
                n.setAttribute('value', chkValue);
                n.setAttribute('indexes', chkIndex);
                //1st option unchecked
                if (elm(tf.fltIds[colIndex] + '_0')) {
                    elm(tf.fltIds[colIndex] + '_0').checked = false;
                }
            }

            if (li.nodeName === itemTag) {
                removeClass(n.childNodes[0], this.selectedItemCssClass);
                addClass(li, this.selectedItemCssClass);
            }
        } else { //removes values and indexes
            if (chkValue !== '') {
                let replaceValue = new RegExp(
                    rgxEsc(chkValue + ' ' + tf.orOperator));
                fltValue = fltValue.replace(replaceValue, '');
                n.setAttribute('value', trim(fltValue));

                let replaceIndex = new RegExp(
                    rgxEsc(chkIndex + tf.separator));
                fltIndexes = fltIndexes.replace(replaceIndex, '');
                n.setAttribute('indexes', fltIndexes);
            }
            if (li.nodeName === itemTag) {
                removeClass(li, this.selectedItemCssClass);
            }
        }
    }

    /**
     * Select filter options programmatically
     * @param  {Number} colIndex Column index
     * @param  {Array}  values   Array of option values to select
     */
    selectOptions(colIndex, values = []) {
        let tf = this.tf;
        let flt = tf.getFilterElement(colIndex);
        if (tf.getFilterType(colIndex) !== CHECKLIST || !flt ||
            values.length === 0) {
            return;
        }

        let lisNb = tag(flt, 'li').length;

        flt.setAttribute('value', '');
        flt.setAttribute('indexes', '');

        for (let k = 0; k < lisNb; k++) {
            let li = tag(flt, 'li')[k];
            let lbl = tag(li, 'label')[0];
            let chk = tag(li, 'input')[0];
            let lblTxt = matchCase(getText(lbl), tf.caseSensitive);

            if (lblTxt !== '' && has(values, lblTxt, tf.caseSensitive)) {
                chk.checked = true;
            } else {
                // Check non-empty-text or empty-text option
                if (values.indexOf(tf.nmOperator) !== -1 &&
                    lblTxt === matchCase(tf.nonEmptyText, tf.caseSensitive)) {
                    chk.checked = true;
                }
                else if (values.indexOf(tf.emOperator) !== -1 &&
                    lblTxt === matchCase(tf.emptyText, tf.caseSensitive)) {
                    chk.checked = true;
                } else {
                    chk.checked = false;
                }
            }
            this.setCheckListValues(chk);
        }
    }

    /**
     * Get filter values for a given column index
     * @param {Number} colIndex Column index
     * @returns {Array} values Collection of selected values
     */
    getValues(colIndex) {
        let tf = this.tf;
        let flt = tf.getFilterElement(colIndex);
        let fltAttr = flt.getAttribute('value');
        let values = isEmpty(fltAttr) ? '' : fltAttr;

        //removes last operator ||
        values = values.substr(0, values.length - 3);
        //turn || separated values into array
        values = values.split(' ' + tf.orOperator + ' ');

        return values;
    }

    /**
     * Destroy CheckList instance
     */
    destroy() {
        this.emitter.off(
            ['build-checklist-filter'],
            (tf, colIndex, isLinked) => this.build(colIndex, isLinked)
        );
        this.emitter.off(
            ['select-checklist-options'],
            (tf, colIndex, values) => this.selectOptions(colIndex, values)
        );
        this.emitter.off(['rows-changed'], () => this.refreshAll());

        this.initialized = false;
    }
}
