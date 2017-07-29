
var id = function (id){ return document.getElementById(id); };
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_3: 'checklist',
    load_filters_on_demand: false
});
tf.init();

var checkList = tf.feature('checkList');
module('Sanity checks');
test('CheckList component', function() {
    deepEqual(typeof checkList, 'object', 'CheckList instanciated');
    deepEqual(checkList.containers instanceof Array, true,
        'Type of containers property');
});

module('UI elements');
test('CheckList UI elements', function() {
    var flt = id(tf.fltIds[3]);
    notEqual(flt, null, 'CheckList UL element');
    deepEqual(flt.firstChild.nodeName, 'LI',
        'First CheckList option element name');
    deepEqual(flt.childNodes.length, 8, 'number of checklist options');
});

module('Behaviour');
test('Can filter on checkList item click', function() {
    var flt3 = tf.getFilterElement(3);

    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('click', true, true);
    tf.setFilterValue(3, '1.1');
    flt3.querySelectorAll('input')[1].dispatchEvent(evObj);

    deepEqual(tf.getValidRows().length, 1, 'Table filtered');
    deepEqual(tf.getFilteredData()[0][1][3], '1.1', 'Matched value');
});
test('Can refresh all drop-down filters', function() {
    //setup
    tf.clearFilters();
    var build = checkList.build;
    var hit = 0;
    checkList.build = function() { hit++ };

    //act
    checkList.refreshAll();

    //assert
    deepEqual(hit, 1, 'build method called');

    checkList.build = build;
});
test('Can select options', function() {
    tf.clearFilters();
    var flt1 = id(tf.fltIds[3]);

    checkList.selectOptions(3, ['1.4', '.6']);

    notEqual(flt1.getAttribute('value').indexOf('1.4'), -1, 'Option selected');
    notEqual(flt1.getAttribute('value').indexOf('.6'), -1, 'Option selected');
});
test('Can get selected values', function() {
    //setup
    var values = ['.6', '1.4'];
    tf.clearFilters();
    tf.setFilterValue(3, values);

    //act
    var result = checkList.getValues(3);

    //assert
    deepEqual(values, result);
});
test('Can return values when no selected options', function() {
    //setup
    tf.clearFilters();

    //act
    var result = checkList.getValues(3);

    //assert
    deepEqual([''], result);
});
test('Can return values checklist element has no value attribute', function() {
    //setup
    tf.getFilterElement(3).removeAttribute('value');

    //act
    var result = checkList.getValues(3);

    //assert
    deepEqual([''], result);
});

// Issue 113, addressing option sorting for numeric values
module('Options sorting');
test('Can sort options', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_2: 'checklist',
        col_3: 'checklist',
        col_4: 'checklist',
        sort_num_asc: [2, 3],
        sort_num_desc: [4]
    });
    tf.init();

    var flt2 = id(tf.fltIds[2]);
    var flt3 = id(tf.fltIds[3]);
    var flt4 = id(tf.fltIds[4]);

    deepEqual(
        flt2.getElementsByTagName('li')[1].firstChild.firstChild.value,
        '286',
        'First option value for column 2'
    );
    deepEqual(
        flt2.getElementsByTagName('li')[7].firstChild.firstChild.value,
        '2781',
        'Last option value for column 2'
    );
    deepEqual(
        flt3.getElementsByTagName('li')[1].firstChild.firstChild.value,
        '.6',
        'First option value for column 3'
    );
    deepEqual(
        flt3.getElementsByTagName('li')[7].firstChild.firstChild.value,
        '3.1',
        'Last option value for column 3'
    );
    deepEqual(
        flt4.getElementsByTagName('li')[1].firstChild.firstChild.value,
        '40',
        'First option value for column 4'
    );
    deepEqual(
        flt4.getElementsByTagName('li')[7].firstChild.firstChild.value,
        '4.3',
        'Last option value for column 4'
    );
});

// Issue 238, empty and non-empty options cannot be selected
module('Empty and non-empty options');
test('Can select empty and non-empty options', function() {
    // setup
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_2: 'checklist',
        col_3: 'checklist',
        enable_empty_option: true,
        enable_non_empty_option: true
    });
    tf.init();
    var checkList = tf.feature('checkList');
    var flt2 = tf.getFilterElement(2);
    var flt3 = tf.getFilterElement(3);

    // act
    checkList.selectOptions(2, [tf.emOperator, tf.nmOperator]);
    checkList.selectOptions(3, [tf.emOperator, tf.nmOperator, '1.4']);

    // assert
    deepEqual(checkList.getValues(2), [tf.emOperator, tf.nmOperator],
        'Filter 2 empty and non-empty options selected');
    notEqual(flt2.getAttribute('value').indexOf(tf.emOperator), -1,
        'Filter 2 options values attribute');
    notEqual(flt2.getAttribute('value').indexOf(tf.nmOperator), -1,
        'Filter 2 options values attribute');
    deepEqual(checkList.getValues(3), [tf.emOperator, tf.nmOperator, '1.4'],
        'Filter 3 options selected');
    notEqual(flt3.getAttribute('value').indexOf(tf.emOperator), -1,
        'Filter 3 options values attribute');
    notEqual(flt3.getAttribute('value').indexOf(tf.nmOperator), -1,
        'Filter 3 options values attribute');
});

module('Tear down');
test('TableFilter removed', function() {
    tf.destroy();
    deepEqual(id(tf.fltIds[3]), null, 'CheckList UL element');
    deepEqual(
        tf.feature('checkList').initialized,
        false,
        'CheckList not initialised'
    );
});
