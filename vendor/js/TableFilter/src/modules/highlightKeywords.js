import {createText, createElm, getText} from '../dom';
import {isArray} from '../types';
import {rgxEsc} from '../string';

/**
 * Highlight matched keywords upon filtering
 *
 * @export
 * @class HighlightKeyword
 */
export class HighlightKeyword {

    /**
     * Creates an instance of HighlightKeyword
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        let f = tf.config();

        /**
         * Css class for highlighted term
         * @type {String}
         */
        this.highlightCssClass = f.highlight_css_class || 'keyword';

        /**
         * TableFilter instance
         * @type {TableFilter}
         */
        this.tf = tf;

        /**
         * TableFilter's emitter instance
         * @type {Emitter}
         */
        this.emitter = tf.emitter;
    }

    /**
     * Initializes HighlightKeyword instance
     */
    init() {
        this.emitter.on(
            ['before-filtering', 'destroy'],
            () => this.unhighlightAll()
        );
        this.emitter.on(
            ['highlight-keyword'],
            (tf, cell, term) => this._processTerm(cell, term)
        );
    }

    /**
     * Highlight occurences of searched term in passed node
     * @param  {Node} node
     * @param  {String} term     Searched term
     * @param  {String} cssClass Css class name
     *
     * TODO: refactor this method
     */
    highlight(node, term, cssClass) {
        // Iterate into this nodes childNodes
        if (node.hasChildNodes) {
            let children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                this.highlight(children[i], term, cssClass);
            }
        }

        if (node.nodeType === 3) {
            let nodeVal = node.nodeValue.toLowerCase();
            let termIdx = nodeVal.indexOf(term.toLowerCase());

            if (termIdx !== -1) {
                let pn = node.parentNode;
                if (pn && pn.className !== cssClass) {
                    // term not highlighted yet
                    let nv = node.nodeValue,
                        // Create a load of replacement nodes
                        before = createText(nv.substr(0, termIdx)),
                        value = nv.substr(termIdx, term.length),
                        after = createText(nv.substr(termIdx + term.length)),
                        text = createText(value),
                        container = createElm('span');
                    container.className = cssClass;
                    container.appendChild(text);
                    pn.insertBefore(before, node);
                    pn.insertBefore(container, node);
                    pn.insertBefore(after, node);
                    pn.removeChild(node);
                }
            }
        }
    }

    /**
     * Removes highlight to nodes matching passed string
     * @param  {String} term
     * @param  {String} cssClass Css class to remove
     */
    unhighlight(term, cssClass) {
        let highlightedNodes = this.tf.tbl.querySelectorAll(`.${cssClass}`);
        for (let i = 0; i < highlightedNodes.length; i++) {
            let n = highlightedNodes[i];
            let nodeVal = getText(n);

            if (nodeVal.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                let parentNode = n.parentNode;
                parentNode.replaceChild(createText(nodeVal), n);
                parentNode.normalize();
            }
        }
    }

    /**
     * Clear all occurrences of highlighted nodes
     */
    unhighlightAll() {
        if (!this.tf.highlightKeywords) {
            return;
        }
        // iterate filters values to unhighlight all values
        this.tf.getFiltersValue().forEach((val) => {
            if (isArray(val)) {
                val.forEach((item) =>
                    this.unhighlight(item, this.highlightCssClass));
            } else {
                this.unhighlight(val, this.highlightCssClass);
            }
        });
    }

    /**  Remove feature */
    destroy() {
        this.emitter.off(
            ['before-filtering', 'destroy'],
            () => this.unhighlightAll()
        );
        this.emitter.off(
            ['highlight-keyword'],
            (tf, cell, term) => this._processTerm(cell, term)
        );
    }

    /**
     * Ensure filtering operators are handled before highlighting any match
     * @param {any} Table cell to look searched term into
     * @param {any} Searched termIdx
     */
    _processTerm(cell, term) {
        let tf = this.tf;
        let reLk = new RegExp(rgxEsc(tf.lkOperator));
        let reEq = new RegExp(tf.eqOperator);
        let reSt = new RegExp(tf.stOperator);
        let reEn = new RegExp(tf.enOperator);
        let reLe = new RegExp(tf.leOperator);
        let reGe = new RegExp(tf.geOperator);
        let reL = new RegExp(tf.lwOperator);
        let reG = new RegExp(tf.grOperator);
        let reD = new RegExp(tf.dfOperator);

        term = term
            .replace(reLk, '')
            .replace(reEq, '')
            .replace(reSt, '')
            .replace(reEn, '');

        if (reLe.test(term) || reGe.test(term) || reL.test(term) ||
            reG.test(term) || reD.test(term)) {
            term = getText(cell);
        }

        if (term === '') {
            return;
        }

        this.highlight(cell, term, this.highlightCssClass);
    }
}
