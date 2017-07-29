
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    extensions:[{ name: 'colsVisibility' }]
});
tf.init();
var ext;

module('Sanity checks');
test('Extension initialization', function() {
    ext = tf.extension('colsVisibility');
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    notEqual(ext, null, 'Extension instanciated');
    deepEqual(ext.initialized, true, 'Extension initialized');
    deepEqual(ext.text, 'Hide: ', 'Text setting');
    deepEqual(ext.btnText, 'Columns&#9660;', 'Button text setting');
});

module('UI checks');
test('UI elements', function() {
    ext = tf.extension('colsVisibility');
    var span = ext.spanEl;
    var cont = ext.contEl;
    var btn = ext.btnEl;
    deepEqual(span.nodeName, 'SPAN', 'Container element');
    deepEqual(cont.nodeName, 'DIV', 'Container element');
    deepEqual(cont.getElementsByTagName('p')[0].innerHTML,
        'Hide: ', 'Expected text');
    deepEqual(btn.nodeName, 'A', 'Button element');
    deepEqual(btn.innerHTML, 'Columns▼');
});
module('Behaviour');
test('Toggle columns list container', function() {
    ext = tf.extension('colsVisibility');
    ext.toggle();
    deepEqual(ext.contEl.style.display, 'inline', 'columns list visible');

    ext.toggle();
    deepEqual(ext.contEl.style.display, 'none', 'columns list visible');
});
test('Hide columns', function() {
    ext = tf.extension('colsVisibility');
    ext.hideCol(2);
    ext.hideCol(3);
    deepEqual(ext.isColHidden(2), true, 'Expected column is hidden');
    deepEqual(ext.isColHidden(3), true, 'Expected column is hidden');
});
test('Show columns', function() {
    ext = tf.extension('colsVisibility');
    ext.showCol(2);
    ext.showCol(3);
    deepEqual(ext.isColHidden(2), false, 'Expected column is displayed');
    deepEqual(ext.isColHidden(3), false, 'Expected column is displayed');
});
test('Toggle column', function() {
    ext = tf.extension('colsVisibility');
    ext.toggleCol(2);
    deepEqual(ext.isColHidden(2), true, 'Expected column is hidden');

    ext.toggleCol(2);
    deepEqual(ext.isColHidden(2), false, 'Expected column is displayed');
});
test('Popup container auto-closes when user clicks away', function() {
    // setup
    ext = tf.extension('colsVisibility');
    ext.toggle();

    // act
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('mouseup', true, true);
    // mouseup fired from a table cell
    tf.tbl.rows[3].cells[2].dispatchEvent(evObj);

    // assert
    deepEqual(ext.contEl.style.display, 'none',
        'Popup container closed after user clicks away'
    );
});
test('Close button closes popup', function() {
    // setup
    ext = tf.extension('colsVisibility');
    ext.toggle();

    // act
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('click', true, true);
    ext.contEl.querySelector('.colVis').dispatchEvent(evObj);

    // assert
    deepEqual(ext.contEl.style.display, 'none',
        'Close button closes popup'
    );
});
test('Button closes popup when already open', function() {
    // setup
    ext = tf.extension('colsVisibility');
    ext.toggle();

    // act
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('click', true, true);
    ext.btnEl.dispatchEvent(evObj);

    // assert
    deepEqual(ext.contEl.style.display, 'none',
        'Close button closes popup'
    );
});
test('Destroy extension', function() {
    ext = tf.extension('colsVisibility');
    ext.destroy();
    deepEqual(ext.initialized, false, 'Extension no longer initialized');
    deepEqual(ext.contEl, null, 'Columns list container removed');
    deepEqual(ext.btnEl, null, 'Button removed');
});
test('Re-initialize extension', function() {
    ext = tf.extension('colsVisibility');
    ext.init();
    deepEqual(ext.initialized, true, 'Extension initialized');
    tf.destroy();
});
