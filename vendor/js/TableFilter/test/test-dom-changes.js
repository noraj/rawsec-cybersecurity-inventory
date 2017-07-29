
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    rows_counter: true
});
tf.init();
var rowsCounter = tf.feature('rowsCounter');
var rowToAdd = tf.tbl.rows[8];

var tf1 = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    rows_counter: true,
    paging: true,
    paging_length: 3
});

module('Sanity checks');
test('Initial verifications', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(tf.getFilterableRowsNb(), 7, 'Initial number of filterable rows');
    deepEqual(tf.getValidRowsNb(), 0, 'Initial number of valid rows');
    notEqual(rowsCounter, null, 'RowsCounter instanciated');
    deepEqual(rowsCounter.label.innerHTML, '7', 'Initial rows count');
});

module('DOM changes');
test('Can filter after row is removed', function() {
    // setup
    tf.clearFilters();
    tf.tbl.deleteRow(-1);

    // act
    tf.filter();

    // assert
    deepEqual(tf.getFilterableRowsNb(), 6,
        'Number of filterable rows after row is removed');
    deepEqual(tf.getValidRowsNb(), 6,
        'Number of valid rows after row is removed');
    deepEqual(rowsCounter.label.innerHTML, '6',
        'Rows count after row is removed');
});

test('Can filter after row is added', function() {
    // setup
    tf.clearFilters();
    tf.tbl.tBodies[0].appendChild(rowToAdd);

    // act
    tf.filter();

    // assert
    deepEqual(tf.getFilterableRowsNb(), 7,
        'Number of filterable rows after row is added');
    deepEqual(tf.getValidRowsNb(), 7,
        'Number of valid rows after row is added');
    deepEqual(rowsCounter.label.innerHTML, '7',
        'Rows count after row is added');
});

test('Can filter the added row', function() {
    // setup
    tf.clearFilters();
    tf.setFilterValue(0, 'Adelaide');
    tf.setFilterValue(1, 'Brisbane');

    // act
    tf.filter();

    // assert
    deepEqual(tf.getFilterableRowsNb(), 7,
        'Number of filterable rows after row is added');
    deepEqual(tf.getValidRowsNb(), 1,
        'Number of valid rows after row is added');
    deepEqual(rowsCounter.label.innerHTML, '1',
        'Rows count after row is added');
});

test('can destroy TableFilter', function() {
    tf.clearFilters();
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'tf instance destroyed');
});

module('DOM changes with paging');
test('Sanity checks', function() {
    // setup
    tf1.init();
    var rowsCounter = tf1.feature('rowsCounter');

    // assert
    deepEqual(tf1 instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(tf1.paging, true, 'Paging is enabled');
    deepEqual(tf1.getFilterableRowsNb(), 7,
        'Initial number of filterable rows');
    deepEqual(tf1.getValidRowsNb(), 7, 'Initial number of valid rows');
    notEqual(rowsCounter, null, 'RowsCounter instanciated');
    deepEqual(rowsCounter.label.innerHTML, '1-3 / 7',
        'Initial rows count');
});

test('Can filter and change a page after row is removed', function() {
    // setup
    var paging = tf1.feature('paging');
    var rowsCounter = tf1.feature('rowsCounter');
    tf1.clearFilters();
    tf1.tbl.deleteRow(-1);

    // act
    tf1.filter();
    paging.setPage(2);

    // assert
    deepEqual(tf1.getFilterableRowsNb(), 6,
        'Number of filterable rows after row is removed');
    deepEqual(tf1.getValidRowsNb(), 6,
        'Number of valid rows after row is removed');
    deepEqual(rowsCounter.label.innerHTML, '4-6 / 6',
        'Rows count after row is removed');
});

test('Can filter and change page after row is added', function() {
    // setup
    var paging = tf1.feature('paging');
    var rowsCounter = tf1.feature('rowsCounter');
    tf1.clearFilters();
    tf1.tbl.tBodies[0].appendChild(rowToAdd);

    // act
    tf1.filter();
    paging.setPage(3);

    // assert
    deepEqual(tf1.getFilterableRowsNb(), 7,
        'Number of filterable rows after row is added');
    deepEqual(tf1.getValidRowsNb(), 7,
        'Number of valid rows after row is added');
    deepEqual(rowsCounter.label.innerHTML, '7-7 / 7',
        'Rows count after row is added');
});

test('Can filter the added row with paging', function() {
    // setup
    var paging = tf1.feature('paging');
    var rowsCounter = tf1.feature('rowsCounter');
    tf1.setFilterValue(0, 'Adelaide');
    tf1.setFilterValue(1, 'Brisbane');

    // act
    paging.setPage(0);
    tf1.filter();

    // assert
    deepEqual(tf1.getFilterableRowsNb(), 7,
        'Number of filterable rows after row is added');
    deepEqual(tf1.getValidRowsNb(), 1,
        'Number of valid rows after row is added');
    deepEqual(rowsCounter.label.innerHTML, '1-1 / 1',
        'Rows count after row is added');
});

test('can destroy TableFilter DOM elements', function() {
    tf1.destroy();
    deepEqual(tf1.isInitialized(), false, 'tf1 instance destroyed');
});
