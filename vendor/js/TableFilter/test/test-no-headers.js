
var tf = new TableFilter('demo', 0, {
    base_path: '../dist/tablefilter/'
});
tf.init();

module('Sanity checks');
test('No headers', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.refRow, 1, 'Reference row index');
    notEqual(tf.getFilterElement(0), null, 'Filter element for column 0');
});

test('Can perform a search', function() {
    tf.setFilterValue(1, 'Ade');
    tf.filter();

    deepEqual(tf.getValidRows(), [1], 'Filtered row');
});

test('Paging with no headers', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', 0, {
        base_path: '../dist/tablefilter/',
        paging: true,
        paging_length: 3
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.refRow, 1, 'Reference row index');
    notEqual(tf.getFilterElement(0), null, 'Filter element for column 0');
});

test('Can perform a search', function() {
    tf.setFilterValue(1, 'Ade');
    tf.filter();

    deepEqual(tf.getValidRows(), [1], 'Filtered row');
});

// Grid layout currently does not handle a table with no headers...
// Raised in issue 110 (https://github.com/koalyptus/TableFilter/issues/110)
test('Grid layout with no header', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        grid_no_headers: true
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersRowIndex(), 1, 'Filters row index');
    deepEqual(tf.refRow, 0, 'Reference row index');
    notEqual(tf.getFilterElement(0), null, 'Filter element for column 0');
    deepEqual(tf.getRowsNb(), 7, 'Filterable rows number');
});
test('Can perform a search', function() {
    tf.setFilterValue(2, '<900');
    tf.filter();

    deepEqual(tf.getValidRows(), [2,3], 'Filtered row');
});

// With no toolbar cannot clear filters :)
test('Popup filters with no header', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', 0, {
        base_path: '../dist/tablefilter/',
        popup_filters: true
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.refRow, 1, 'Reference row index');
    notEqual(tf.getFilterElement(0), null, 'Filter element for column 0');
});

test('Can perform a search', function() {
    tf.setFilterValue(1, 'Melbourne');
    tf.filter();

    deepEqual(tf.getValidRows(), [4], 'Filtered row');
});

module('Tear-down');
test('TableFilter removed', function() {
    tf.clearFilters();
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
