
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    grid_layout: true,
    extensions:[{
        name: 'filtersVisibility',
        visible_at_start: false
    }]
});
tf.init();

var gridLayout = tf.feature('gridLayout');
var filtersRow = gridLayout.headTbl.rows[tf.getFiltersRowIndex()];

module('Sanity checks');
test('Filters visibility extension', function() {
    var ext = tf.extension('filtersVisibility');
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    notEqual(ext, null, 'Extension instanciated');
    deepEqual(ext.initialized, true, 'Extension initialized');
});

module('UI');
test('Filters visibility extension', function() {
    var ext = tf.extension('filtersVisibility');
    var cont = ext.contEl;
    var btn = ext.btnEl;
    deepEqual(filtersRow.style.display, 'none', 'Filters hidden');
    deepEqual(cont.nodeName, 'SPAN', 'Container element');
    deepEqual(btn.nodeName, 'A', 'Button element');
});

module('Check behaviours');
test('Toggle filters', function() {
    var ext = tf.extension('filtersVisibility');
    ext.toggle();

    deepEqual(filtersRow.style.display, '', 'Filters displayed');

    ext.toggle();
    deepEqual(filtersRow.style.display, 'none', 'Filters hidden');
});

test('Remove extension', function() {
    var ext = tf.extension('filtersVisibility');
    ext.destroy();
    deepEqual(ext.contEl, null, 'Container element removed');
    deepEqual(ext.btnEl, null, 'Button element removed');
    deepEqual(ext.initialized, false, 'Extension not initialized');
});
