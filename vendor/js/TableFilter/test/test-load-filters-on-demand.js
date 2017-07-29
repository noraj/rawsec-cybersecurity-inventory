
var id = function (id){ return document.getElementById(id); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_0: 'multiple',
    col_1: 'select',
    col_2: 'checklist',
    load_filters_on_demand: true
});
tf.init();

var flt1 = tf.getFilterElement(0);
var flt2 = tf.getFilterElement(1);
var flt3 = null;
var flt3ContId = tf.feature('checkList').prfx + '2_' + tf.id;
var flt3Cont = id(flt3ContId);

function buildChecklist(tf, colIdx){
    var checkList = tf.feature('checkList');
    checkList.build(colIdx);
    checkList.containers[colIdx].onclick = null;
    checkList.containers[colIdx].title = '';
}


module('Sanity checks');
test('Select type filters exist', function() {
    deepEqual(tf.loadFltOnDemand, true, 'loadFltOnDemand property');
    notEqual(flt1, null, 'Filter 1 element exists');
    notEqual(flt2, null, 'Filter 2 element exists');
    deepEqual(flt3, null, 'Filter 3 element exists');
    deepEqual(tf.getFilterType(0), 'multiple', 'Expected filter type 1');
    deepEqual(tf.getFilterType(1), 'select', 'Expected filter type 2');
    deepEqual(tf.getFilterType(2), 'checklist', 'Expected filter type 3');
});

module('UI Filter elements');
test('Filters are empty', function() {
    deepEqual(flt1.options.length, 1, 'Number of options for filter 1');
    deepEqual(flt2.options.length, 1, 'Number of options for filter 2');
    deepEqual(flt1.options[0].text, 'Clear', 'Filter 1 text');
    deepEqual(flt2.options[0].text, 'Clear', 'Filter 2 text');
    deepEqual(flt3Cont.innerHTML, 'Click to load filter data', 'Filter 3 text');
});

test('Filters are populated after activation', function() {
    flt1.focus();
    flt2.focus();
    buildChecklist(tf, 2);

    flt3 = tf.getFilterElement(2);

    deepEqual(flt1.options.length, 3, 'Number of options for filter 1');
    deepEqual(flt2.options.length, 7, 'Number of options for filter 2');
    deepEqual(flt3.childNodes.length, 8, 'Number of options for filter 3');
});

test('TableFilter re-initialised with grid layout', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_0: 'multiple',
        col_1: 'select',
        col_2: 'checklist',
        load_filters_on_demand: true,
        grid_layout: true
    });
    tf.init();

    flt1 = tf.getFilterElement(0);
    flt2 = tf.getFilterElement(1);
    flt3 = null;
    flt3ContId = tf.feature('checkList').prfx + '2_' + tf.id;
    flt3Cont = id(flt3ContId);
});

module('Behaviour with grid layout');
test('Selet type filters exist', function() {
    deepEqual(tf.loadFltOnDemand, true, 'loadFltOnDemand property');
    notEqual(flt1, null, 'Filter 1 element exists');
    notEqual(flt2, null, 'Filter 2 element exists');
    deepEqual(flt3, null, 'Filter 3 element exists');
    deepEqual(tf.getFilterType(0), 'multiple', 'Expected filter type 1');
    deepEqual(tf.getFilterType(1), 'select', 'Expected filter type 2');
    deepEqual(tf.getFilterType(2), 'checklist', 'Expected filter type 3');
});

module('UI Filter elements');
test('Filters are empty', function() {
    deepEqual(flt1.options.length, 1, 'Number of options for filter 1');
    deepEqual(flt2.options.length, 1, 'Number of options for filter 2');
    deepEqual(flt1.options[0].text, 'Clear', 'Filter 1 text');
    deepEqual(flt2.options[0].text, 'Clear', 'Filter 2 text');
    deepEqual(flt3Cont.innerHTML, 'Click to load filter data', 'Filter 3 text');
});

test('Filters are populated after activation', function() {
    flt1.focus();
    flt2.focus();
    buildChecklist(tf, 2);
    flt3 = tf.getFilterElement(2);

    deepEqual(flt1.options.length, 3, 'Number of options for filter 1');
    deepEqual(flt2.options.length, 7, 'Number of options for filter 2');
    deepEqual(flt3.childNodes.length, 8, 'Number of options for filter 3');
});

test('Filters can filter table', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.setFilterValue(1, 'Canberra');
    tf.setFilterValue(2, '286');
    tf.filter();

    deepEqual(tf.getValidRows().length, 1, 'Number of results');
});

test('TableFilter removed', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
    tf = null;
});
