
(function(win, TableFilter){

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        mark_active_columns: true
    });
    tf.init();

    module('Sanity checks');
    test('Active columns', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    });

    test('Active columns', function() {
        tf.setFilterValue(1, 'Bri');
        tf.setFilterValue(3, '>2');
        tf.filter();
        var header1 = tf.getHeaderElement(1);
        var header3 = tf.getHeaderElement(3);
        deepEqual(
            header1.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');
        deepEqual(
            header3.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');
    });

    test('Active columns with paging', function() {
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            mark_active_columns: true,
            paging: true
        });
        tf.init();

        tf.setFilterValue(1, 'Bri');
        tf.setFilterValue(3, '>2');
        tf.filter();
        var header1 = tf.getHeaderElement(1);
        var header3 = tf.getHeaderElement(3);
        deepEqual(
            header1.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');
        deepEqual(
            header3.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');
    });

    test('Grid layout active columns', function() {
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            mark_active_columns: true,
            grid_layout: true
        });
        tf.init();

        tf.setFilterValue(1, 'Bri');
        tf.setFilterValue(3, '>2');
        tf.filter();
        var header1 = tf.getHeaderElement(1);
        var header3 = tf.getHeaderElement(3);
        deepEqual(
            header1.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');
        deepEqual(
            header3.className.indexOf('activeHeader') !== -1,
            true,
            'Active filter indicator');

        tf.destroy();
    });

})(window, TableFilter);
