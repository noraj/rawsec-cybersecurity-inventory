/**
 * Sorting utilities
 */

/**
 * Case insensitive compare function for passed strings
 * @param  {String} First string
 * @param  {String} Second string
 * @return {Number} -1 if first string lower than second one
 *                  0 if first string same order as second one
 *                  1 if first string greater than second one
 */
export const ignoreCase = (a, b) => {
    let x = a.toLowerCase();
    let y = b.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

/**
 * Sorts passed numbers in a ascending manner
 * @param {Number} First number
 * @param {Number} Second number
 * @param {Number} Negative, zero or positive number
 */
export const numSortAsc = (a, b) => (a - b);

/**
 * Sorts passed numbers in a descending manner
 * @param {Number} First number
 * @param {Number} Second number
 * @param {Number} Negative, zero or positive number
 */
export const numSortDesc = (a, b) => (b - a);
