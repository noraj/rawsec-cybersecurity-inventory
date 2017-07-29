var tf = new TableFilter('demo', 0, {
    base_path: '../dist/tablefilter/'
});
tf.init();

module('Sanity checks');
test('Only headers with no rows', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.nbCells, 0, 'Number of columns');
    deepEqual(tf.refRow, 1, 'Reference row index');
});

module('Tear-down');
test('TableFilter removed', function() {
    tf.clearFilters();
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
