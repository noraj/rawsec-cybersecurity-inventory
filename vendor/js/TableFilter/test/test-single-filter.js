var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    single_filter: true
});
tf.init();

module('Sanity checks');
test('Single filter', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersId().length, 1, 'Number of filter');
    deepEqual(tf.getFiltersId(), ['flt0_demo'], 'Filter ID');
    deepEqual(typeof tf.getFilterElement(0), 'object', 'Filter element');
});

module('Behaviour');
test('Filter', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.filter();
    deepEqual(tf.getValidRows().length, 4, 'Filtered rows number');
    tf.clearFilters();
});

module('External single filter');
test('Sanity checks', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        single_filter: true,
        external_flt_grid: true,
        external_flt_grid_ids: ['single-search']
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersId().length, 1, 'Number of filter');
    deepEqual(tf.getFiltersId(), ['flt0_demo'], 'Filter ID');
    deepEqual(typeof tf.getFilterElement(0), 'object', 'Filter element');
});

module('Behaviour');
test('Filter', function() {
    tf.setFilterValue(0, 'Bris');
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows number');
    tf.clearFilters();
});

module('Single filter with grid layout');
test('Sanity checks', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        single_filter: true,
        grid_layout: true
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.getFiltersId().length, 1, 'Number of filter');
    deepEqual(tf.getFiltersId(), ['flt0_demo'], 'Filter ID');
    deepEqual(typeof tf.getFilterElement(0), 'object', 'Filter element');
});

module('Behaviour');
test('Filter', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.filter();
    deepEqual(tf.getValidRows().length, 4, 'Filtered rows number');
    tf.clearFilters();
});
