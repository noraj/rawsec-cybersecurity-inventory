
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions: [{ name: 'filtersVisibility' }]
});
tf.init();

var extTargetElement = document.createElement('div');
extTargetElement.setAttribute('id', 'test');
document.body.insertBefore(extTargetElement, tf.tbl);

module('Sanity checks');
test('Filters visibility extension', function() {
    var ext = tf.extension('filtersVisibility');
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    notEqual(ext, null, 'Extension instanciated');
    deepEqual(ext.initialized, true, 'Extension initialized');
});

module('Check UI');
test('UI elements', function() {
    var ext = tf.extension('filtersVisibility');
    var cont = ext.contEl;
    var btn = ext.btnEl;
    deepEqual(cont.nodeName, 'SPAN', 'Container element');
    deepEqual(btn.nodeName, 'A', 'Button element');
    deepEqual(btn.title, 'Toggle filters', 'Button tooltip');
    deepEqual(btn.firstChild.nodeName, 'IMG', 'Image element');
    deepEqual(btn.firstChild.alt, 'Collapse filters', 'Button tooltip');
});

module('Check behaviours');
test('Toggle filters', function() {
    var ext = tf.extension('filtersVisibility');
    ext.toggle();
    var filtersRow = tf.tbl.rows[tf.getFiltersRowIndex()];
    deepEqual(filtersRow.style.display, 'none', 'Filters hidden');
    ext.toggle();
    deepEqual(filtersRow.style.display, '', 'Filters displayed');
});

test('Remove extension', function() {
    var ext = tf.extension('filtersVisibility');
    ext.destroy();
    deepEqual(ext.contEl, null, 'Container element removed');
    deepEqual(ext.btnEl, null, 'Button element removed');
    deepEqual(ext.initialized, false, 'Extension not initialized');
});
