
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/'
});
tf.init();

module('Sanity checks');
test('Emitter instance', function() {
    deepEqual(typeof tf.emitter, 'object', 'Emitter instanciated');
    deepEqual(typeof tf.emitter.events, 'object', 'Emitter events property');
    deepEqual(typeof tf.emitter.on, 'function', 'Emitter on method');
    deepEqual(typeof tf.emitter.off, 'function', 'Emitter off method');
    deepEqual(typeof tf.emitter.emit, 'function', 'Emitter emit method');
});

module('Behaviour');
test('Can subscribe', function(){
    var emitter = tf.emitter;
    var output = null;
    emitter.on(['before-filtering'],
        function(){ output = 'before-filtering'; });

    tf.filter();

    deepEqual(emitter.events['before-filtering'].length, 1,
        'Expected number of listeners');
    deepEqual(output, 'before-filtering', 'Expected output');
});

test('Can unsubscribe', function(){
    var emitter = tf.emitter;
    var output = null;
    emitter.off(['before-filtering'],
        function(){ output = 'before-filtering'; });

    tf.filter();

    deepEqual(emitter.events['before-filtering'].length, 0,
        'Expected number of listeners');
    deepEqual(output, null, 'Expected output');
});

test('Can emit', function(){
    var emitter = tf.emitter;
    var output = null;
    emitter.on(['hello'], function(arg){ output = arg; });

    emitter.emit('hello', 'world');

    deepEqual(output, 'world', 'Event emitted');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
