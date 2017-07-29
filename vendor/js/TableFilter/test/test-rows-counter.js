
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    rows_counter: true
});
tf.init();
var rowsCounter = tf.feature('rowsCounter');

module('Sanity checks');
test('RowsCounter component', function() {
    notEqual(rowsCounter, null, 'RowsCounter instanciated');
    notEqual(rowsCounter.container, null, 'RowsCounter container element');
    notEqual(rowsCounter.label, null, 'RowsCounter label element');
});

module('Feature interface');
test('Properties', function() {
    deepEqual(
        rowsCounter.tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(rowsCounter.feature, 'rowsCounter', 'Feature name');
    deepEqual(rowsCounter.enabled, true, 'Feature enabled');
    deepEqual(rowsCounter.initialized, true, 'Feature enabled');
    deepEqual(typeof rowsCounter.emitter, 'object',
        'Feature has emitter instance');
    deepEqual(typeof rowsCounter.config, 'object', 'TF configuration object');
    deepEqual(typeof rowsCounter.init, 'function', 'Feature init method');
    deepEqual(typeof rowsCounter.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof rowsCounter.reset, 'function', 'Feature reset method');
    deepEqual(typeof rowsCounter.enable, 'function', 'Feature enable method');
    deepEqual(typeof rowsCounter.disable, 'function', 'Feature enable method');
    deepEqual(
        typeof rowsCounter.isEnabled, 'function', 'Feature enable method');
});
test('Can destroy', function() {
    rowsCounter.destroy();
    deepEqual(rowsCounter.initialized, false, 'not initialised');
});
test('Can reset', function() {
    rowsCounter.reset();
    deepEqual(rowsCounter.enabled, true, 'enabled');
});
test('Can disable', function() {
    rowsCounter.disable();
    deepEqual(rowsCounter.enabled, false, 'disabled');
});
test('Can enable', function() {
    rowsCounter.enable();
    deepEqual(rowsCounter.enabled, true, 'enabled');
});
test('Can init', function() {
    rowsCounter.destroy();
    rowsCounter.enable();
    rowsCounter.init();
    deepEqual(rowsCounter.enabled, true, 'enabled');
});
test('Can check is enabled', function() {
    rowsCounter.isEnabled();
    deepEqual(rowsCounter.enabled, true, 'enabled');
});

module('Behaviour');
test('RowsCounter value', function() {
    equal(rowsCounter.label.innerHTML,
        7, 'Counter value');
});

test('RowsCounter component with filtered table', function() {
    tf.setFilterValue(0, 'Syd');
    tf.filter();

    equal(rowsCounter.label.innerHTML,
        4, 'Counter value');

    tf.clearFilters();
});

module('Pagination');
test('RowsCounter component with paging', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        rows_counter: true,
        paging: true,
        paging_length: 3
    });
    tf.init();
    equal(tf.feature('rowsCounter').label.innerHTML,
        '1-3 / 7', 'Counter value with paging');
});
test('Can calculate page on page change', function() {
    //setup
    var paging = tf.feature('paging');

    //act
    paging.setPage(2);

    //assert
    equal(tf.feature('rowsCounter').label.innerHTML,
        '4-6 / 7', 'Counter value with paging');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
