
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    state: {
        types: ['local_storage'],
        filters: true,
        page_number: true,
        page_length: true
    },
    paging: true,
    results_per_page: ['Records: ', [2, 4, 6]],
});
tf.init();
var state = tf.feature('state');
var storage = state.storage;

module('Sanity checks');
test('State instance', function() {
    deepEqual(typeof storage, 'object', 'Storage is instantiated');
    deepEqual(storage.enableLocalStorage, true, 'Local storage enabled');
    deepEqual(storage.enableCookie, false, 'Cookies disabled');
    deepEqual(storage.state, state, 'State instance');
    deepEqual(storage.emitter, state.emitter, 'Emitter instance');
});

module('Behaviour');
test('Can save and retrieve state', function() {
    // setup
    var stateObj = {
        'page': 2,
        'page_length': 4,
        'col_2': {'flt': '>500'}
    };

    // act
    state.emitter.emit('state-changed', tf, stateObj);

    // assert
    deepEqual(storage.retrieve(), stateObj, 'State saved');
});

test('Can sync state', function() {
    // setup
    storage.save({'page':2,'page_length':4,'col_2':{'flt':'>500'}});

    // act
    storage.sync();

    // assert
    deepEqual(tf.getValidRows(), [2,3,5,6,7,8], 'Table filters are synced');
});

test('Can remove state', function() {
    // setup
    storage.save({'page':2,'page_length':4,'col_2':{'flt':'>500'}});

    // act
    storage.remove();

    // assert
    deepEqual(storage.retrieve(), null, 'State removed from storage');
});

test('Can get storage key', function() {
    // assert
    deepEqual(storage.getKey(),
        '{"key":"TF_demo","path":"/test/test-storage-local.html"}',
        'Storage key returned'
    );
});

module('Tear-down');
test('Can destroy', function() {
    // act
    storage.destroy();

    // assert
    deepEqual(storage.state, null, 'State instance is null');
    deepEqual(storage.emitter, null, 'Emitter instance is null');
    deepEqual(storage.retrieve(), null, 'Persisted state cleared');
});
