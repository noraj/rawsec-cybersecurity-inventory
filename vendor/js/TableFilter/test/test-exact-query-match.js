(function(win, TableFilter){
    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        exact_match: true
    });
    tf.init();

    module('Sanity checks');
    test('Enable exact query match', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.exactMatch, true, 'Exact query match enabled');
    });

    module('Behaviour');
    test('After filtering with `syd`', function() {
        tf.setFilterValue(0, 'syd');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'No matches');
    });

    test('After filtering with `sydney`', function() {
        tf.setFilterValue(0, 'sydney');
        tf.filter();
        deepEqual(tf.getValidRows().length>0, true, 'Matches');
    });

    module('Re-instantiate with exact match by column');
    test('Enable extact query match by column', function() {
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            columns_exact_match: [true, true, false, false, false]
        });
        tf.init();

        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.hasExactMatchByCol, true,
            'Exact query match by column enabled');
    });
    module('Behaviour with exact match by column');
    test('After filtering with `syd`', function() {
        tf.setFilterValue(0, 'syd');
        tf.setFilterValue(1, 'bris');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'No matches');
    });

    test('After filtering with `sydney`', function() {
        tf.clearFilters();
        tf.setFilterValue(0, 'sydney');
        tf.filter();
        deepEqual(tf.getValidRows().length>0, true, 'Matches');
    });

})(window, TableFilter);
