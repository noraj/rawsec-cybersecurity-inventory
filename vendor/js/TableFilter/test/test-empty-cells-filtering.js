(function(win, TableFilter){
    // issue 162 - https://github.com/koalyptus/TableFilter/issues/162
    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        locale: 'en-GB',
        col_types: ['date', 'string']
    });
    tf.init();

    module('Sanity checks');
    test('TableFilter instance', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
    });
    test('Can filter empty cells', function(){
        // act
        tf.setFilterValue(1, 'test');
        tf.filter();
        // assert
        deepEqual(tf.getValidRows().length, 0, 'Expected filtered rows');
    });
    test('Can filter dd.MM.yyyy date type', function(){
        // setup
        tf.clearFilters();
        // act
        tf.setFilterValue(0, '18.07.2020');
        tf.filter();
        // assert
        deepEqual(tf.getValidRows().length, 2, 'Expected filtered rows');
    });
    test('Can clear filters', function(){
        // act
        tf.clearFilters();
        // assert
        deepEqual(tf.getValidRows().length, 2167, 'Expected filtered rows');
    });

    module('Tear-down');
    test('Can destroy TF', function() {
        // act
        tf.destroy();

        // assert
        deepEqual(tf.isInitialized(), false, 'Filters removed');
    });
})(window, TableFilter);
