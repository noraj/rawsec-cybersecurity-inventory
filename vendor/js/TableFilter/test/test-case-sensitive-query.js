(function(win, TableFilter){
    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        case_sensitive: true
    });
    tf.init();

    module('Sanity checks');
    test('Enable case sensitive query match', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.caseSensitive, true, 'Case sensitive query match enabled');
    });

    module('Behaviour');
    test('After filtering with `sydney`', function() {
        tf.setFilterValue(0, 'sydney');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'No matches');
    });

    test('After filtering with `Sydney`', function() {
        tf.setFilterValue(0, 'Sydney');
        tf.filter();
        deepEqual(tf.getValidRows().length>0, true, 'Matches');
    });

    test('After filtering with `ade`', function() {
        tf.setFilterValue(0, 'ade');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'No matches');
    });

    test('After filtering with `Ade`', function() {
        tf.setFilterValue(0, 'Ade');
        tf.filter();
        deepEqual(tf.getValidRows().length>0, true, 'Matches');
    });

})(window, TableFilter);
