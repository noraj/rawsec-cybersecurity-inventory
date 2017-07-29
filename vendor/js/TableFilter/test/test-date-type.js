
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_types: [
        null, null, null,
        { type: 'formatted-number', decimal: ',', thousands: ','},
        'formatted-number', null,
        { type: 'date', locale: 'fr', },
        { type: 'date', locale: 'en', format: '{dd}-{MM}-{yyyy|yy}' },
        { type: 'date', locale: 'en', format: ['{dd}-{months}-{yyyy|yy}'] },
        'IpAddress'
    ]
});
tf.init();

var dateType = tf.feature('dateType');

module('Sanity checks');
test('DateType feature', function() {
    deepEqual(typeof dateType, 'object', 'DateType instanciated');
    deepEqual(dateType.locale, 'en', 'DateType default locale');
    notEqual(dateType.datetime, null, 'Sugar date instance');
});

module('Feature interface');
test('Properties', function() {
    deepEqual(dateType.tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(dateType.feature, 'dateType', 'Feature name');
    deepEqual(dateType.enabled, true, 'Feature enabled');
    deepEqual(dateType.initialized, true, 'Feature enabled');
    deepEqual(typeof dateType.emitter, 'object',
        'Feature has emitter instance');
    deepEqual(typeof dateType.config, 'object', 'TF configuration object');
    deepEqual(typeof dateType.init, 'function', 'Feature init method');
    deepEqual(typeof dateType.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof dateType.reset, 'function', 'Feature reset method');
    deepEqual(typeof dateType.enable, 'function', 'Feature enable method');
    deepEqual(typeof dateType.disable, 'function', 'Feature enable method');
    deepEqual(typeof dateType.isEnabled, 'function', 'Feature enable method');
});

test('Can destroy', function() {
    dateType.destroy();
    deepEqual(dateType.initialized, false, 'not initialised');
});
test('Can reset', function() {
    dateType.reset();
    deepEqual(dateType.enabled, true, 'enabled');
});
test('Can disable', function() {
    dateType.disable();
    deepEqual(dateType.enabled, false, 'disabled');
});
test('Can enable', function() {
    dateType.enable();
    deepEqual(dateType.enabled, true, 'enabled');
});
test('Can init', function() {
    dateType.destroy();
    dateType.enable();
    dateType.init();
    deepEqual(dateType.initialized, true, 'initialised');
});
test('Can check is enabled', function() {
    dateType.isEnabled();
    deepEqual(dateType.enabled, true, 'enabled');
});

module('Behaviour');
test('Can parse date', function() {
    var date0 = dateType.parse('10/25/2017', 'en-US');
    var date1 = dateType.parse('25/10/2017', 'en-GB');
    var date2 = dateType.parse('1997-07-16T19:20:30+01:00', 'en');
    var date3 = dateType.parse('14-Jul-2005', 'fr');
    var date4 = dateType.parse(null);
    var date5 = dateType.parse(undefined);
    var date6 = dateType.parse('');

    deepEqual(date0, new Date(2017, 9, 25, 0, 0, 0, 0), 'en-US date');
    deepEqual(date1, new Date(2017, 9, 25, 0, 0, 0, 0), 'en-GB date');
    deepEqual(date2.toISOString(), '1997-07-16T18:20:30.000Z', 'ISO date');
    deepEqual(date3, new Date(2005, 6, 14, 0, 0, 0, 0), 'fr date');
    deepEqual(date4.toISOString(), '1970-01-01T00:00:00.000Z', 'null date');
    deepEqual(date5 instanceof Date, true, 'undefined date');
    deepEqual(isNaN(date6), true, 'Invalid date');
});

test('Can validate date', function() {
    var v0 = dateType.isValid('10/25/2017', 'en-US');
    var v1 = dateType.isValid('25/10/2017', 'en-GB');
    var v2 = dateType.isValid('1997-07-16T19:20:30+01:00', 'en');
    var v3 = dateType.isValid('14-Jul-2005', 'fr');
    var v4 = dateType.isValid('hello', 'en');
    var v5 = dateType.isValid(null, 'en');
    var v6 = dateType.isValid(undefined, 'en');
    var v7 = dateType.isValid('');

    deepEqual(v0, true, 'valid en-US date');
    deepEqual(v1, true, 'valid en-GB date');
    deepEqual(v2, true, 'valid ISO date');
    deepEqual(v3, true, 'valid fr date');
    deepEqual(v4, false, 'Invalid date');
    deepEqual(v5, true, 'Valid date');
    deepEqual(v6, true, 'Valid date');
    deepEqual(v7, false, 'Invalid date');
});

test('Can get column date type options', function() {
    var opts0 = dateType.getOptions(0);
    var opts8 = dateType.getOptions(8);
    var opts99 = dateType.getOptions(99);
    var opts = dateType.getOptions(0, [{ type: 'date'}]);

    deepEqual(opts0, {}, 'no column date type options');
    deepEqual(
        opts8,
        { type: 'date', locale: 'en', format: ['{dd}-{months}-{yyyy|yy}'] },
        'column options'
    );
    deepEqual(opts99, {}, 'out of range column index');
    deepEqual(opts, {type: 'date'}, 'column date type from passed collection');
});

test('Can add date formats from config', function() {
    var nbFormats = dateType.datetime.getLocale('fr').compiledFormats.length;

    dateType.addConfigFormats([{
        type: 'date', locale: 'fr',
        format: ['{dd}-{months}-{yyyy|yy}']
    }]);

    deepEqual(
        dateType.datetime.getLocale('fr').compiledFormats.length,
        nbFormats+1,
        'Expected number of formats for current locale'
    );
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
