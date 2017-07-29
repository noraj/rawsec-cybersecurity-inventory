import {Feature} from '../feature';
import {createElm, createText, elm, removeElm} from '../dom';
import {addEvt, targetEvt, removeEvt} from '../event';
import {NONE} from '../const';
import {root} from '../root';

const WIKI_URL = 'https://github.com/koalyptus/TableFilter/wiki/' +
    '4.-Filter-operators';
const WEBSITE_URL = 'http://koalyptus.github.io/TableFilter/';

/**
 * Help UI component
 */
export class Help extends Feature {

    /**
     * Creates an instance of Help
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'help');

        let f = this.config;

        /**
         * ID of main custom container element
         * @type {String}
         */
        this.tgtId = f.help_instructions_target_id || null;

        /**
         * ID of custom container element for instructions
         * @type {String}
         */
        this.contTgtId = f.help_instructions_container_target_id ||
            null;

        /**
         * Instructions text (accepts HTML)
         * @type {String}
         */
        this.instrText = f.help_instructions_text ?
            f.help_instructions_text :
            'Use the filters above each column to filter and limit table ' +
            'data. Advanced searches can be performed by using the following ' +
            'operators: <br /><b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, ' +
            '<b>&gt;=</b>, <b>=</b>, <b>*</b>, <b>!</b>, <b>{</b>, <b>}</b>, ' +
            '<b>||</b>,<b>&amp;&amp;</b>, <b>[empty]</b>, <b>[nonempty]</b>, ' +
            '<b>rgx:</b><br/><a href="' + WIKI_URL + '" target="_blank">' +
            'Learn more</a><hr/>';

        /**
         * Instructions HTML
         * @type {String}
         */
        this.instrHtml = f.help_instructions_html || null;

        /**
         * Help button text ('?')
         * @type {String}
         */
        this.btnText = f.help_instructions_btn_text || '?';

        /**
         * Custom help button HTML
         * @type {String}
         */
        this.btnHtml = f.help_instructions_btn_html || null;

        /**
         * Css class for help button
         * @type {String}
         */
        this.btnCssClass = f.help_instructions_btn_css_class || 'helpBtn';

        /**
         * Css class for help container element
         * @type {String}
         */
        this.contCssClass = f.help_instructions_container_css_class ||
            'helpCont';

        /**
         * Button DOM element
         * @type {DOMElement}
         */
        this.btn = null;

        /**
         * Help container DOM element
         * @type {DOMElement}
         */
        this.cont = null;

        /**
         * Bound mouseup wrapper
         * @private
         */
        this.boundMouseup = null;

        /**
         * Default HTML appended to instructions text
         * @type {String}
         */
        this.defaultHtml = '<div class="helpFooter"><h4>TableFilter ' +
            'v' + tf.version + '</h4>' + '<a href="' + WEBSITE_URL +
            '" target="_blank">' + WEBSITE_URL + '</a>' +
            '<br/><span>&copy;2015-' + tf.year + ' {AUTHOR}</span>' +
            '<div align="center" style="margin-top:8px;">' +
            '<a href="javascript:void(0);" class="close">Close</a></div></div>';

        this.emitter.on(['init-help'], () => this.init());
    }

    /**
     * Mouse-up event handler handling popup auto-close behaviour
     * @private
     */
    onMouseup(evt) {
        let targetElm = targetEvt(evt);

        while (targetElm && targetElm !== this.cont && targetElm !== this.btn) {
            targetElm = targetElm.parentNode;
        }

        if (targetElm !== this.cont && targetElm !== this.btn) {
            this.toggle();
        }

        return;
    }

    /**
     * Initialise Help instance
     */
    init() {
        if (this.initialized) {
            return;
        }

        let tf = this.tf;

        let btn = createElm('span');
        let cont = createElm('div');

        this.boundMouseup = this.onMouseup.bind(this);

        //help button is added to defined element
        if (!this.tgtId) {
            tf.setToolbar();
        }
        let targetEl = !this.tgtId ? tf.rDiv : elm(this.tgtId);
        targetEl.appendChild(btn);

        let divContainer = !this.contTgtId ? btn : elm(this.contTgtId);

        if (!this.btnHtml) {
            divContainer.appendChild(cont);
            let helplink = createElm('a', ['href', 'javascript:void(0);']);
            helplink.className = this.btnCssClass;
            helplink.appendChild(createText(this.btnText));
            btn.appendChild(helplink);
            addEvt(helplink, 'click', () => this.toggle());
        } else {
            btn.innerHTML = this.btnHtml;
            let helpEl = btn.firstChild;
            addEvt(helpEl, 'click', () => this.toggle());
            divContainer.appendChild(cont);
        }

        if (!this.instrHtml) {
            cont.innerHTML = this.instrText;
            cont.className = this.contCssClass;
        } else {
            if (this.contTgtId) {
                divContainer.appendChild(cont);
            }
            cont.innerHTML = this.instrHtml;
            if (!this.contTgtId) {
                cont.className = this.contCssClass;
            }
        }
        cont.innerHTML += this.defaultHtml;
        addEvt(cont, 'click', () => this.toggle());

        this.cont = cont;
        this.btn = btn;
        /** @inherited */
        this.initialized = true;
    }

    /**
     * Toggle help pop-up
     */
    toggle() {
        // check only if explicitily set to false as in this case undefined
        // signifies the help feature is enabled by default
        if (this.enabled === false) {
            return;
        }

        // ensure mouseup event handler is removed
        removeEvt(root, 'mouseup', this.boundMouseup);

        let divDisplay = this.cont.style.display;
        if (divDisplay === '' || divDisplay === NONE) {
            this.cont.style.display = 'inline';
            addEvt(root, 'mouseup', this.boundMouseup);
        } else {
            this.cont.style.display = NONE;
        }
    }

    /**
     * Remove help UI
     */
    destroy() {
        if (!this.initialized) {
            return;
        }
        removeElm(this.btn);
        this.btn = null;

        removeElm(this.cont);
        this.cont = null;

        this.boundMouseup = null;

        this.initialized = false;
    }

}
