import {Date as SugarDate} from 'sugar-date';
import 'sugar-date/locales';
import {Feature} from '../feature';
import {isObj, isArray} from '../types';
import {DATE} from '../const';
import {root} from '../root';

/**
 * Wrapper for Sugar Date module providing datetime helpers and locales
 * @export
 * @class DateType
 */
export class DateType extends Feature {

    /**
     * Creates an instance of DateType
     * @param {TableFilter} tf TableFilter instance
     */
    constructor(tf) {
        super(tf, 'dateType');

        /**
         * Global locale
         * @type {String}
         */
        this.locale = tf.locale;

        /**
         * Sugar Date instance
         * @type {Object}
         */
        this.datetime = SugarDate;

        this.enable();
    }

    /**
     * Initialize DateType instance
     */
    init() {
        if (this.initialized) {
            return;
        }

        // Set global locale
        this.datetime.setLocale(this.locale);

        // Add formats from column types configuration if any
        this.addConfigFormats(this.tf.colTypes);

        this.emitter.on(
            ['add-date-type-formats'],
            (tf, types) => this.addConfigFormats(types)
        );

        // Broadcast date-type initialization
        this.emitter.emit('date-type-initialized', this.tf, this);

        /** @inherited */
        this.initialized = true;
    }

    /**
     * Parse a string representation of a date for a specified locale and return
     * a date object
     * @param {String} dateStr String representation of a date
     * @param {String} localeCode Locale code (ie 'en-us')
     * @returns {Date}
     */
    parse(dateStr, localeCode) {
        return this.datetime.create(dateStr, localeCode);
    }

    /**
     * Check string representation of a date for a specified locale is valid
     * @param {any} dateStr String representation of a date
     * @param {any} localeCode Locale code (ie 'en-us')
     * @returns {Boolean}
     */
    isValid(dateStr, localeCode) {
        return this.datetime.isValid(this.parse(dateStr, localeCode));
    }

    /**
     * Return the type object of a specified column as per configuration or
     * passed collection
     * @param {Number} colIndex Column index
     * @param {Array} types Collection of column types, optional
     * @returns {Object}
     */
    getOptions(colIndex, types) {
        types = types || this.tf.colTypes;
        let colType = types[colIndex];
        return isObj(colType) ? colType : {};
    }

    /**
     * Add date time format(s) to a locale as specified by the passed
     * collection of column types, ie:
     *  [
     *      'string',
     *      'number',
     *      { type: 'date', locale: 'en', format: ['{dd}/{MM}/{yyyy}']}
     * ]
     *
     * @param {Array} [types=[]] Collection of column types
     */
    addConfigFormats(types=[]) {
        types.forEach((type, idx) => {
            let options = this.getOptions(idx, types);
            if (options.type === DATE && options.hasOwnProperty('format')) {
                let locale = this.datetime.getLocale(
                    options.locale || this.locale
                );
                let formats = isArray(options.format) ?
                    options.format : [options.format];

                // Sugar date module throws exceptions with locale.addFormat
                try {
                    formats.forEach((format) => {
                        locale.addFormat(format);
                    });
                } catch (ex) {
                    root.console.error(ex);
                }
            }
        });
    }

    /**
     * Remove DateType instance
     */
    destroy() {
        if (!this.initialized) {
            return;
        }

        // TODO: remove added formats

        this.emitter.off(
            ['add-date-type-formats'],
            (tf, types) => this.addConfigFormats(types)
        );

        this.initialized = false;
    }
}
