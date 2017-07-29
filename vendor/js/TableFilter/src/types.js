
/**
 * Types utilities
 */

const UNDEFINED = void 0;

/**
 * Return an empty function
 * @return {Function}
 */
export const EMPTY_FN = function() {};

/**
 * Check passed argument is an object
 * @param  {Object}  obj
 * @return {Boolean}
 */
export const isObj =
    (obj) => Object.prototype.toString.call(obj) === '[object Object]';

/**
 * Check passed argument is a function
 * @param  {Function} obj
 * @return {Boolean}
 */
export const isFn =
    (obj) => Object.prototype.toString.call(obj) === '[object Function]';

/**
 * Check passed argument is an array
 * @param  {Array}  obj
 * @return {Boolean}
 */
export const isArray =
    (obj) => Object.prototype.toString.call(obj) === '[object Array]';

/**
 * Check passed argument is a string
 * @param {String} obj objue
 * @returns {Boolean}
 */
export const isString =
    (obj) => Object.prototype.toString.call(obj) === '[object String]';

/**
 * Check passed argument is a number
 * @param {Number} obj
 * @returns {Boolean}
 */
export const isNumber =
    (obj) => Object.prototype.toString.call(obj) === '[object Number]';

/**
 * Check passed argument is undefined
 * @param  {Any}  obj
 * @return {Boolean}
 */
export const isUndef = (obj) => obj === UNDEFINED;

/**
 * Check passed argument is null
 * @param  {Any}  obj
 * @return {Boolean}
 */
export const isNull = (obj) => obj === null;

/**
 * Check passed argument is empty (undefined, null or empty string)
 * @param  {Any}  obj
 * @return {Boolean}
 */
export const isEmpty = (obj) => isUndef(obj) || isNull(obj) || obj.length === 0;
