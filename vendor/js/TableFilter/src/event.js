import {root} from './root';

/**
 * DOM event utilities
 */

/**
 * Add event handler for specified event on passed element
 *
 * @param {DOMElement} obj Element
 * @param {String} type Event type
 * @param {Function} Handler
 * @param {Boolean} capture Specifiy whether the event should be executed in
 * the capturing or in the bubbling phase
 */
export const addEvt = (obj, type, func, capture) => {
    if (obj.addEventListener) {
        obj.addEventListener(type, func, capture);
    }
    else if (obj.attachEvent) {
        obj.attachEvent('on' + type, func);
    } else {
        obj['on' + type] = func;
    }
};

/**
 * Remove event handler for specified event on passed element
 *
 * @param {DOMElement} obj Element
 * @param {String} type Event type
 * @param {Function} Handler
 * @param {Boolean} capture Specifiy whether the event should be executed in
 * the capturing or in the bubbling phase
 */
export const removeEvt = (obj, type, func, capture) => {
    if (obj.removeEventListener) {
        obj.removeEventListener(type, func, capture);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + type, func);
    } else {
        obj['on' + type] = null;
    }
};

/**
 * Prevents further propagation of the current event in the bubbling phase
 *
 * @param {Event} evt Event on the DOM
 */
export const stopEvt = (evt) => {
    if (!evt) {
        evt = root.event;
    }
    if (evt.stopPropagation) {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
};

/**
 * Cancels the event if it is cancelable, without stopping further
 * propagation of the event.
 *
 * @param {Event} evt Event on the DOM
 */
export const cancelEvt = (evt) => {
    if (!evt) {
        evt = root.event;
    }
    if (evt.preventDefault) {
        evt.preventDefault();
    } else {
        evt.returnValue = false;
    }
};

/**
 * Reference to the object that dispatched the event
 *
 * @param {Event} evt Event on the DOM
 * @returns {DOMElement}
 */
export const targetEvt = (evt) => {
    if (!evt) {
        evt = root.event;
    }
    return evt.target || evt.srcElement;
};

/**
 * Returns the Unicode value of pressed key
 *
 * @param {Event} evt Event on the DOM
 * @returns {Number}
 */
export const keyCode = (evt) => {
    return evt.charCode ? evt.charCode :
        (evt.keyCode ? evt.keyCode : (evt.which ? evt.which : 0));
};
