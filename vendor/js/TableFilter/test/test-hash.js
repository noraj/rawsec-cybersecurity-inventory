
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    state: {
        types: ['hash'],
        filters: true,
        page_number: true,
        page_length: true
    },
    paging: true,
    results_per_page: ['Records: ', [2, 4, 6]],
});
tf.init();
var state = tf.feature('state');
var hash = state.hash;

module('Sanity checks');
test('State instance', function() {
    deepEqual(typeof hash, 'object', 'Hash is instantiated');
    deepEqual(hash.lastHash, '', 'Last stored hash');
    deepEqual(hash.state, state, 'State instance');
    deepEqual(hash.emitter, state.emitter, 'Emitter instance');
});

module('Behaviour');
test('Can update URL hash', function() {
    // setup
    var stateObj = {
        'page': 2,
        'page_length': 4,
        'col_2': {'flt': '>500'}
    };

    // act
    state.emitter.emit('state-changed', tf, stateObj);

    // assert
    deepEqual(location.hash,
        '#%7B%22page%22%3A2%2C%22page_length%22%3A4%2C%22'+
            'col_2%22%3A%7B%22flt%22%3A%22%3E500%22%7D%7D',
        'URL hash updated');
});

test('Can parse a URL hash', function() {
    // setup
    // URL-encoded version of:
    //    #{"page":2,"page_length":4,"col_2":{"flt":">500"}}
    var hashStr = '#%7B%22page%22%3A2%2C%22page_length%22%3A4'+
            '%2C%22col_2%22%3A%7B%22flt%22%3A%22%3E500%22%7D%7D'
    // act
    var result = hash.parse(hashStr);

    // assert
    deepEqual(result,
        {
            'page': 2,
            'page_length': 4,
            'col_2': {'flt': '>500'}
        },
        'Parsed hash'
    );
});

test('Can sync state', function() {
    // setup
    location.hash = '#{"page":2,"page_length":4,"col_2":{"flt":">500"}}';

    // act
    hash.sync();

    // assert
    deepEqual(tf.getValidRows(), [2,3,5,6,7,8], 'Table filters are synced');
});

module('Tear-down');
test('Can destroy', function() {
    // setup
    location.hash = '';

    // act
    hash.destroy();

    // assert
    deepEqual(hash.state, null, 'State instance is null');
    deepEqual(hash.lastHash, null, 'Last hash reference is null');
    deepEqual(hash.emitter, null, 'Emitter instance is null');
});
