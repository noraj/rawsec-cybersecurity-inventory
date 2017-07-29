
var tag = function (elm, tag){ return elm.getElementsByTagName(tag); };
var outputBefore = null;
var outputAfter = null;

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions:[{
        name: 'sort',
        types: ['string','string','number','number','number'],
        on_sort_loaded: startSimple,
        on_before_sort: function(o, col){
            outputBefore = [o, col];
        },
        on_after_sort: function(o, col){
            outputAfter = [o, col];
        }
    }]
});
tf.init();

var tf1 = new TableFilter('demo2', {
    base_path: '../dist/tablefilter/',
    paging: true,
    extensions:[{
        name: 'sort',
        types: ['string','string','number','number','number'],
        on_sort_loaded: startPaging
    }]
});
tf1.init();

function startSimple(tf, sort){

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
            indicator = tag(th, 'img');

        deepEqual(indicator.length, 1, 'Sort indicator in header element');
    });

    module('Behaviour');
    test('Sort sanity checks', function() {
        sort.sortByColumnIndex(0);

        deepEqual(sort.sorted, true, 'Table column sorted');
        deepEqual(
            outputBefore[0] instanceof TableFilter,
            true,
            'on_before_sort callback param 0 verified'
        );
        deepEqual(outputBefore[1], 0,
            'on_before_sort callback param 1 verified'
        );
        deepEqual(
            outputAfter[0] instanceof TableFilter,
            true,
            'on_after_sort callback param 0 verified'
        );
        deepEqual(outputAfter[1], 0,
            'on_after_sort callback param 1 verified'
        );
    });

    test('Sort API', function() {
        sort.sortByColumnIndex(1, true);
        deepEqual(tf.getColValues(1)[0], 'Perth', 'Descending sort');

        sort.sortByColumnIndex(1, false);
        deepEqual(tf.getColValues(1)[0], 'Adelaide', 'Descending sort');
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

function startPaging(tf, sort){

    module('Sanity checks');
    test('Sort extension', function() {
        notEqual(sort, null, 'Sort instanciated');
        deepEqual(sort.stt instanceof SortableTable, true, 'Sort type');
        deepEqual(sort.sorted, false, 'Table not sorted');
        deepEqual(sort.initialized, true, 'Sort initialized');
        deepEqual(tf.paging, true, 'Table is paged');
    });

    module('UI elements');
    test('Sort UI elements', function() {
        var th = tf.getHeaderElement(0),
            indicator = tag(th, 'img');

        deepEqual(indicator.length, 1, 'Sort indicator in header element');
    });

    test('Sort behaviour', function() {
        sort.sortByColumnIndex(0);

        deepEqual(sort.sorted, true, 'Table column sorted');
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
