import {root} from './root';
import {isArray, isString, isUndef} from './types';
import {trim} from './string';

/**
 * DOM utilities
 */

const doc = root.document;

/**
 * Returns text + text of children of given node
 * @param  {NodeElement} node
 * @return {String}
 */
export const getText = (node) => {
    if (isUndef(node.textContent)) {
        return trim(node.innerText);
    }
    return trim(node.textContent);
}

/**
 * Returns the first text node contained in the supplied node
 * @param  {NodeElement} node node
 * @return {String}
 */
export const getFirstTextNode = (node) => {
    for (let i = 0; i < node.childNodes.length; i++) {
        let n = node.childNodes[i];
        if (n.nodeType === 3) {
            return n.data;
        }
    }
}

/**
 * Creates an html element with given collection of attributes
 * @param  {String} tag a string of the html tag to create
 * @param  {Array} an undetermined number of arrays containing the with 2
 *                    items, the attribute name and its value ['id','myId']
 * @return {Object}     created element
 */
export const createElm = (...args) => {
    let tag = args[0];
    if (!isString(tag)) {
        return null;
    }

    let el = doc.createElement(tag);
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];

        if (isArray(arg) && arg.length === 2) {
            el.setAttribute(arg[0], arg[1]);
        }
    }

    return el;
}

/**
 * Removes passed node from DOM
 * @param  {DOMElement} node
 * @return {DOMElement} old node reference
 */
export const removeElm = (node) => node.parentNode.removeChild(node);

/**
 * Returns a text node with given text
 * @param  {String} txt
 * @return {Object}
 */
export const createText = (txt) => doc.createTextNode(txt);

/**
 * Determine whether the passed elements is assigned the given class
 * @param {DOMElement} ele DOM element
 * @param {String} cls CSS class name
 * @returns {Boolean}
 */
export const hasClass = (ele, cls) => {
    if (isUndef(ele)) {
        return false;
    }

    if (supportsClassList()) {
        return ele.classList.contains(cls);
    }
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Adds the specified class to the passed element
 * @param {DOMElement} ele DOM element
 * @param {String} cls CSS class name
 */
export const addClass = (ele, cls) => {
    if (isUndef(ele)) {
        return;
    }

    if (supportsClassList()) {
        ele.classList.add(cls);
        return;
    }

    if (ele.className === '') {
        ele.className = cls;
    }
    else if (!hasClass(ele, cls)) {
        ele.className += ' ' + cls;
    }
}

/**
 * Removes the specified class to the passed element
 * @param {DOMElement} ele DOM element
 * @param {String} cls CSS class name
 */
export const removeClass = (ele, cls) => {
    if (isUndef(ele)) {
        return;
    }

    if (supportsClassList()) {
        ele.classList.remove(cls);
        return;
    }
    let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)', 'g');
    ele.className = ele.className.replace(reg, '');
}

/**
 * Creates and returns an option element
 * @param  {String}  text  option text
 * @param  {String}  value option value
 * @param  {Boolean} isSel whether option is selected
 * @return {Object}        option element
 */
export const createOpt = (text, value, isSel) => {
    let isSelected = isSel ? true : false;
    let opt = isSelected ?
            createElm('option', ['value', value], ['selected', 'true']) :
            createElm('option', ['value', value]);
    opt.appendChild(createText(text));
    return opt;
}

/**
 * Creates and returns a checklist item
 * @param  {String} id  index of check item
 * @param  {String} chkValue  check item value
 * @param  {String} labelText check item label text
 * @return {Object}           li DOM element
 */
export const createCheckItem = (id, chkValue, labelText) => {
    let li = createElm('li');
    let label = createElm('label', ['for', id]);
    let check = createElm('input',
        ['id', id],
        ['name', id],
        ['type', 'checkbox'],
        ['value', chkValue]
    );
    label.appendChild(check);
    label.appendChild(createText(labelText));
    li.appendChild(label);
    li.label = label;
    li.check = check;
    return li;
}

/**
 * Returns the element matching the supplied Id
 * @param  {String} id  Element identifier
 * @return {DOMElement}
 */
export const elm = (id) => doc.getElementById(id);

/**
 * Returns list of element matching the supplied tag name
 * @param  {String} tagname  Tag name
 * @return {NodeList}
 */
export const tag = (o, tagname) => o.getElementsByTagName(tagname);

// HTML5 classList API
function supportsClassList() {
    return doc.documentElement.classList;
}
