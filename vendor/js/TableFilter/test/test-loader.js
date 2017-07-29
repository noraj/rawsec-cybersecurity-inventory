
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    loader: true
});
tf.init();

var loader = tf.feature('loader');

module('Sanity checks');
test('Loader component', function() {
    notEqual(loader, null, 'Loader instanciated');
    equal(loader.cont.nodeName, 'DIV', 'Loader DOM container');
});

module('Feature interface');
test('Properties', function() {
    deepEqual(loader.tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(loader.feature, 'loader', 'Feature name');
    deepEqual(loader.enabled, true, 'Feature enabled');
    deepEqual(loader.initialized, true, 'Feature enabled');
    deepEqual(typeof loader.config, 'object', 'TF configuration object');
    deepEqual(typeof loader.init, 'function', 'Feature init method');
    deepEqual(typeof loader.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof loader.reset, 'function', 'Feature reset method');
    deepEqual(typeof loader.enable, 'function', 'Feature enable method');
    deepEqual(typeof loader.disable, 'function', 'Feature enable method');
    deepEqual(typeof loader.isEnabled, 'function', 'Feature enable method');
});
test('Can destroy', function() {
    loader.destroy();
    deepEqual(loader.initialized, false, 'not initialised');
});
test('Can reset', function() {
    loader.reset();
    deepEqual(loader.enabled, true, 'enabled');
});
test('Can disable', function() {
    loader.disable();
    deepEqual(loader.enabled, false, 'disabled');
});
test('Can enable', function() {
    loader.enable();
    deepEqual(loader.enabled, true, 'enabled');
});
test('Can init', function() {
    loader.destroy();
    loader.enable();
    loader.init();
    deepEqual(loader.enabled, true, 'enabled');
});
test('Can check is enabled', function() {
    loader.isEnabled();
    deepEqual(loader.enabled, true, 'enabled');
});

module('Behaviour');
test('Can show loader', function() {
    loader.show('');
    deepEqual(loader.cont.style.display, '', 'Loader is displayed');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
