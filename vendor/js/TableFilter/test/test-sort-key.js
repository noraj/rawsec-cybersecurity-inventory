
var tag = function (elm, tag){ return elm.getElementsByTagName(tag); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions:[{
        name: 'sort',
        types:[
            'String',
            'Number',
            'String',
            'String',
            'EU',
            'US',
            'String',
            'dmydate',
            'mdydate'
        ],
        on_sort_loaded: start
    }]
});
tf.init();

function start(tf, sort){

    module('Sanity checks');
    test('Sort extension', function() {
        notEqual(sort, null, 'Sort instanciated');
        deepEqual(sort.stt instanceof SortableTable, true, 'Sort type');
        deepEqual(sort.sorted, false, 'Table not sorted');
        deepEqual(sort.initialized, true, 'Sort initialized');
    });

    module('UI elements');
    test('Sort UI elements', function() {
        var th = tf.getHeaderElement(0),
            indicator = tag(th, 'img'),
            validRows = tf.getValidRows(true);

        deepEqual(indicator.length, 1, 'Sort indicator in header element');
        deepEqual(
            (tf.tbl.rows[validRows[0]].cells[1]).innerHTML,
            'AUY78',
            'First custom key cell text before sorting');
    });

    test('Sort behaviour', function() {
        validRows = tf.getValidRows();
        sort.sortByColumnIndex(1);

        deepEqual(sort.sorted, true, 'Table column sorted');
        deepEqual(
            (tf.tbl.rows[validRows[0]].cells[1]).innerHTML,
            'QT1',
            'First custom key cell text after sorting');
    });

    module('Destroy and re-init');
    test('Remove sort', function() {
        sort.destroy();
        var th = tf.getHeaderElement(0),
            indicator = tag(th, 'img');
        deepEqual(sort.initialized, false, 'Sort is removed');
        deepEqual(indicator.length, 0, 'Sort indicator is removed');
    });

}
