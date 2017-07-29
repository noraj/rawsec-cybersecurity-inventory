
var tag = function (elm, tag){ return elm.getElementsByTagName(tag); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions:[{
        name: 'sort',
        types:[
            'String',
            'enforceinteger',
            'String',
            'String',
            'EU',
            'US',
            'String',
            'dmydate',
            'mdydate'
        ],
        on_sort_loaded: function(tf, sort){
            sort.addSortType('enforceinteger', customIntegerSorter);
            startTest(tf, sort);
        }
    }]
});

//Custom sorter function
function customIntegerSorter(val){
    var m = val.match(/\d+/);
    return parseInt(m[0], 10);
}

tf.init();

function startTest(tf, sort){
    module('Sanity checks');
    test('Sort extension', function() {
        notEqual(sort, null, 'Sort instanciated');
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
        var validRows = tf.getValidRows(true);
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
