
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions:[{
        name: 'filtersVisibility',
        target_id: 'test',
        btn_text: 'Hello'
    }]
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
    var btn = ext.btnEl;
    deepEqual(
        extTargetElement.firstChild.nodeName, 'SPAN', 'Container element');
    deepEqual(btn.nodeName, 'A', 'Button element');
    deepEqual(btn.textContent || btn.innerText, 'Hello', 'Expected text');
    ext.destroy();
});

test('Button without icon', function() {
    var ext = tf.extension('filtersVisibility');

    ext.btnEl = null;
    ext.targetId = null;
    ext.btnText = '';
    ext.collapseBtnHtml = ext.defaultText;
    ext.enableIcon = false;
    ext.init();

    deepEqual(ext.contEl.nodeName, 'SPAN', 'Container element');
    deepEqual(ext.btnEl.nodeName, 'A', 'Button element');
    deepEqual(ext.btnEl.innerHTML, 'Toggle filters', 'Expected text');
});
