
var tag = function (elm, tag){ return elm.getElementsByTagName(tag); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    grid_layout: true,
    extensions:[{
        name: 'sort',
        types: ['string','string','number','number','number'],
        on_sort_loaded: startSimple
    }]
});
tf.init();

var tf1 = new TableFilter('demo2', {
    base_path: '../dist/tablefilter/',
    paging: true,
    grid_layout: true,
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
