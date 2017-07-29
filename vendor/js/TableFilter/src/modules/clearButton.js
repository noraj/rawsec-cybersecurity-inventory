import {Feature} from '../feature';
import {createElm, createText, elm, removeElm} from '../dom';
import {addEvt} from '../event';

/**
 * Clear button UI component
 */
export class ClearButton extends Feature {

    /**
     * Creates an instance of ClearButton
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'btnReset');

        let f = this.config;

        /**
         * Container element ID
         * @type {String}
         */
        this.targetId = f.btn_reset_target_id || null;

        /**
         * Clear button container element
         * @type {DOMElement}
         * @private
         */
        this.container = null;

        /**
         * Clear button element
         * @type {DOMElement}
         * @private
         */
        this.element = null;

        /**
         * Text for the clear button
         * @type {String}
         */
        this.text = f.btn_reset_text || 'Reset';

        /**
         * Css class for reset button
         * @type {String}
         */
        this.cssClass = f.btn_reset_css_class || 'reset';

        /**
         * Tooltip text for the clear button
         * @type {String}
         */
        this.tooltip = f.btn_reset_tooltip || 'Clear filters';

        /**
         * Custom Html string for the clear button
         * @type {String}
         */
        this.html = f.btn_reset_html ||
            (!tf.enableIcons ? null :
                '<input type="button" value="" class="' + this.cssClass +
                '" ' + 'title="' + this.tooltip + '" />');
    }

    /**
     * Click event handler for clear button
     * @private
     */
    onClick() {
        if (!this.isEnabled()) {
            return;
        }
        this.tf.clearFilters();
    }

    /**
     * Initialize clear button component
     */
    init() {
        let tf = this.tf;

        if (this.initialized) {
            return;
        }

        let cont = createElm('span');

        // reset button is added to defined element
        if (!this.targetId) {
            tf.setToolbar();
        }
        let targetEl = !this.targetId ? tf.rDiv : elm(this.targetId);
        targetEl.appendChild(cont);

        if (!this.html) {
            let fltReset = createElm('a', ['href', 'javascript:void(0);']);
            fltReset.className = this.cssClass;
            fltReset.appendChild(createText(this.text));
            cont.appendChild(fltReset);
            addEvt(fltReset, 'click', () => this.onClick());
        } else {
            cont.innerHTML = this.html;
            let resetEl = cont.firstChild;
            addEvt(resetEl, 'click', () => this.onClick());
        }
        this.element = cont.firstChild;
        this.container = cont;

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Destroy ClearButton instance
     */
    destroy() {
        if (!this.initialized) {
            return;
        }
        removeElm(this.element);
        removeElm(this.container);
        this.element = null;
        this.container = null;
        this.initialized = false;
    }
}
