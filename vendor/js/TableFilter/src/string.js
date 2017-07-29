import {remove as removeDiacritics} from 'diacritics';

/**
 * String utilities
 */

/**
 * Removes whitespace from both sides of passed string
 * @param  {String} text
 * @return {String}
 */
export const trim = (text) => {
    if (text.trim) {
        return text.trim();
    }
    return text.replace(/^\s*|\s*$/g, '');
}

/**
 * Checks if passed string is empty
 * @param {String} text
 * @return {Boolean}
 */
export const isEmpty = (text) => trim(text) === '';

/**
 * Makes regex safe string by escaping special characters from passed string
 * @param {String} text
 * @return {String} escaped string
 */
export const rgxEsc = (text) => {
    let chars = /[-\/\\^$*+?.()|[\]{}]/g;
    let escMatch = '\\$&';
    return String(text).replace(chars, escMatch);
}

/**
 * Returns passed string as lowercase if caseSensitive flag set false. By
 * default it returns the string with no casing changes.
 * @param {String} text
 * @return {String} string
 */
export const matchCase = (text, caseSensitive = false) => {
    if (!caseSensitive) {
        return text.toLowerCase();
    }
    return text;
}

/**
 * Checks if passed data contains the searched term
 * @param  {String} term                Searched term
 * @param  {String} data                Data string
 * @param  {Boolean} exactMatch         Exact match
 * @param  {Boolean} caseSensitive      Case sensitive
 * @param  {Boolean} ignoreDiacritics   Ignore diacritics
 * @return {Boolean}
 */
export const contains = (term, data, exactMatch = false, caseSensitive = false,
    ignoreDiacritics = false) => {
    // Improved by Cedric Wartel (cwl) automatic exact match for selects and
    // special characters are now filtered
    let regexp;
    let modifier = caseSensitive ? 'g' : 'gi';
    if (ignoreDiacritics) {
        term = removeDiacritics(term);
        data = removeDiacritics(data);
    }
    if (exactMatch) {
        regexp = new RegExp('(^\\s*)' + rgxEsc(term) + '(\\s*$)',
            modifier);
    } else {
        regexp = new RegExp(rgxEsc(term), modifier);
    }
    return regexp.test(data);
}
