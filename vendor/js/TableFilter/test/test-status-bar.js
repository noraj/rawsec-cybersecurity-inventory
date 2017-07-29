var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    status_bar: true
});
tf.init();

var statusBar = tf.feature('statusBar');
module('Sanity checks');
test('Status bar component', function() {
    deepEqual(typeof statusBar, 'object', 'StatusBar instantiated');
    notEqual(statusBar.container, null, 'container property');
});

module('Feature interface');
test('Properties', function() {
    deepEqual(statusBar.tf instanceof TableFilter,
        true, 'TableFilter instance');
    deepEqual(statusBar.feature, 'statusBar', 'Feature name');
    deepEqual(statusBar.enabled, true, 'Feature enabled');
    deepEqual(statusBar.initialized, true, 'Feature enabled');
    deepEqual(typeof statusBar.emitter, 'object',
        'Feature has emitter instance');
    deepEqual(typeof statusBar.config, 'object', 'TF configuration object');
    deepEqual(typeof statusBar.init, 'function', 'Feature init method');
    deepEqual(typeof statusBar.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof statusBar.reset, 'function', 'Feature reset method');
    deepEqual(typeof statusBar.enable, 'function', 'Feature enable method');
    deepEqual(typeof statusBar.disable, 'function', 'Feature enable method');
    deepEqual(typeof statusBar.isEnabled, 'function', 'Feature enable method');
});
test('Can destroy', function() {
    statusBar.destroy();
    deepEqual(statusBar.initialized, false, 'not initialised');
});
test('Can reset', function() {
    statusBar.reset();
    deepEqual(statusBar.enabled, true, 'enabled');
});
test('Can disable', function() {
    statusBar.disable();
    deepEqual(statusBar.enabled, false, 'disabled');
});
test('Can enable', function() {
    statusBar.enable();
    deepEqual(statusBar.enabled, true, 'enabled');
});
test('Can init', function() {
    statusBar.destroy();
    statusBar.enable();
    statusBar.init();
    deepEqual(statusBar.enabled, true, 'enabled');
});
test('Can check is enabled', function() {
    statusBar.isEnabled();
    deepEqual(statusBar.enabled, true, 'enabled');
});

module('UI elements');
test('Status bar  UI elements', function() {
    var container = statusBar.container,
        label = statusBar.msgContainer;
    deepEqual(container.nodeName, 'DIV', 'Status bar container');
    deepEqual(label.nodeName, 'SPAN', 'Status bar label');
});

module('Destroy');
test('Remove UI', function() {
    statusBar.destroy();
    var container = statusBar.container,
        label = statusBar.msgContainer;
    deepEqual(container, null, 'Status bar container removed');
    deepEqual(label, null, 'Status bar button removed');
});

test('Re-set UI', function() {
    statusBar.text = '→←';
    statusBar.init();

    var label = statusBar.labelContainer;
    notEqual(
        label.innerHTML.indexOf('→←'), -1, 'Status bar text');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
