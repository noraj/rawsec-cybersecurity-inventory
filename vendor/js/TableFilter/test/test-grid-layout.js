
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    grid_layout: true
});
tf.init();

var gridLayout = tf.feature('gridLayout');
module('Sanity checks');
test('GridLayout component', function() {
    deepEqual(typeof gridLayout, 'object', 'GridLayout instanciated');
    notEqual(gridLayout.tblMainCont, null, 'GridLayout main container element');
    notEqual(gridLayout.tblCont, null,
        'GridLayout main HTML table container element');
    notEqual(gridLayout.headTblCont, null,
        'GridLayout headers container element');
    notEqual(gridLayout.headTbl, null, 'GridLayout headers HTML table');
    deepEqual(tf.refRow, 0, 'Reference row index');
    deepEqual(tf.headersRow, 0, 'Headers row index');
    deepEqual(tf.filtersRowIndex, 1, 'Filters row index');
});

test('Destroy TableFilter', function() {
    gridLayout.destroy();
    deepEqual(gridLayout.tblMainCont, null, 'Main container element removed');
    deepEqual(gridLayout.tblCont, null,
        'Main HTML table container element removed');
    deepEqual(gridLayout.headTblCont, null,
        'Headers container element removed');
    deepEqual(gridLayout.headTbl, null, 'Headers HTML table element removed');
    notEqual(gridLayout.sourceTblHtml, null, 'Table reference is kept');
});

test('Reset TableFilter', function() {
    tf.destroy();
    tf.init();
    deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
    deepEqual(typeof gridLayout, 'object', 'GridLayout instanciated');
});
