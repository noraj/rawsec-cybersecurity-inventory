/**
 * Array utilities
 */

import {matchCase} from './string';

/**
 * Checks if given item can be found in the passed collection
 * @param  {Array} arr  collection
 * @param  {Any} val  item to search
 * @param  {Boolean} caseSensitive respects case if true
 * @return {Boolean}
 */
export const has = (arr, val, caseSensitive) => {
    let sCase = Boolean(caseSensitive);
    for (var i = 0, l = arr.length; i < l; i++) {
        if (matchCase(arr[i].toString(), sCase) === val) {
            return true;
        }
    }
    return false;
}
