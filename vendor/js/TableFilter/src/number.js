import {isNumber} from './types';

/**
 * Takes a string, removes all formatting/cruft and returns the raw float value
 * @param {String} Formatted number
 * @param {String} Decimal type '.' or ','
 * @return {Number} Unformatted number
 *
 * https://github.com/openexchangerates/accounting.js/blob/master/accounting.js
 */
export const parse = (value, decimal = '.') => {
    // Return the value as-is if it's already a number
    if (isNumber(value)) {
        return value;
    }

    // Build regex to strip out everything except digits, decimal point and
    // minus sign
    let regex = new RegExp('[^0-9-' + decimal + ']', ['g']);
    let unformatted = parseFloat(
        ('' + value)
        .replace(/\((.*)\)/, '-$1') // replace bracketed values with negatives
        .replace(regex, '')         // strip out any cruft
        .replace(decimal, '.')      // make sure decimal point is standard
    );

    // This will fail silently
    return !isNaN(unformatted) ? unformatted : 0;
}
