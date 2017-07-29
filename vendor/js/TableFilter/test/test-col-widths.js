
(function(win, TableFilter){

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_widths: ['150px', '100px', '175px', '120px', null]
    });
    tf.init();

    module('Sanity checks');
    test('Column widths', function() {
        var cols = tf.tbl.getElementsByTagName('col');
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
        deepEqual(cols[1].style.width, '100px', 'Expected column width');
        deepEqual(cols[4].style.width, '', 'Expected column width');
    });

    test('Grid layout column widths', function() {
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            col_widths: ['150px', '100px', '175px', '120px', '200px'],
            grid_layout: true,
            sort: false
        });
        tf.init();
        var cols = tf.feature('gridLayout').headTbl.getElementsByTagName('col');
        deepEqual(cols[0].style.width, '150px', 'Expected column width');
        deepEqual(cols[4].style.width, '200px', 'Expected column width');
    });

})(window, TableFilter);
