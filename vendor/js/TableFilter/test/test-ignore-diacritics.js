(function(win, TableFilter){
    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        ignore_diacritics: true
    });
    tf.init();

    module('Sanity checks');
    test('Enable ignore diacritics', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.ignoreDiacritics, true, 'Ignore diacritics enabled');
    });

    module('Behaviour');
    test('Filter with `jero`', function() {
        tf.setFilterValue(1, 'jero');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Expected match');
    });

    test('Filter with `jérô`', function() {
        tf.setFilterValue(1, 'jérô');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Expected match');
    });

    test('Filter with `brun`', function() {
        tf.setFilterValue(1, 'brun');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Expected match');
    });

    test('Filter with `brün`', function() {
        tf.setFilterValue(1, 'brün');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Expected match');
    });

    test('Ignore diacritcs default', function() {
        tf.destroy();
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/'
        });
        tf.init();

        tf.setFilterValue(1, 'jero');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, '0 matches');

        tf.clearFilters();
        tf.setFilterValue(1, 'jérô');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, '1 matches');
    });

    test('Ignore diacritcs on a column basis', function() {
        tf.destroy();
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            ignore_diacritics: [false, true, false]
        });
        tf.init();

        tf.setFilterValue(0, 'falo');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'Column: 0 - 0 matches');

        tf.clearFilters();
        tf.setFilterValue(0, 'falò');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Column: 0 - 1 matches');

        tf.clearFilters();
        tf.setFilterValue(1, 'jero');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Column: 1 - 1 matches');

        tf.clearFilters();
        tf.setFilterValue(1, 'jérô');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Column: 1 - 1 matches');
    });

    module('Tear-down');
    test('can destroy', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Removed');
    });

})(window, TableFilter);
