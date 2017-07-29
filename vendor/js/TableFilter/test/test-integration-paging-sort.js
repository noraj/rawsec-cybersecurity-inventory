var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    paging: true,
    paging_length: 2,
    results_per_page: ['Results per page ', [2,4,6]],
    extensions: [{
        name: 'sort',
        types: ['string', 'string', 'number', 'number', 'number']
    }]
});
tf.init();

var paging = tf.feature('paging');

module('Sanity checks');
test('Paging component', function() {
    notEqual(paging, null, 'Paging instanciated');
    deepEqual(paging.pagingLength, 2, 'Paging length');
    deepEqual(paging.nbPages, 4, 'Number of pages');
});
test('Sort extension', function() {
    var sort = tf.extension('sort');
    notEqual(sort, null, 'Sort instanciated');
    deepEqual(sort.stt instanceof SortableTable, true, 'Sort type');
    deepEqual(sort.sorted, false, 'Table not sorted');
    deepEqual(sort.initialized, true, 'Sort initialized');
});

module('Paging when a column is sorted');
test('It contains options', function() {
    var sort = tf.extension('sort');
    sort.sortByColumnIndex(0);

    deepEqual(paging.pagingSlc.options.length, 4, 'Expected options number');
});
test('Can select a page', function() {
    var sort = tf.extension('sort');
    sort.sortByColumnIndex(1);
    paging.setPage(3);

    deepEqual(paging.pagingSlc.selectedIndex, 2, 'Expected selected option');
});

module('Changing pages when column is sorted (issue #70)');
test('Can change page', function() {
    var sort = tf.extension('sort');
    tf.setFilterValue(2, '>400');
    sort.sortByColumnIndex(1);
    sort.sortByColumnIndex(1);
    paging.setPage(3);

    deepEqual(paging.getPage(), 3, 'Expected page number');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
