
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    alternate_rows: true
});
tf.init();
var tbl = tf.tbl;
var altRows = tf.feature('alternateRows');

module('Sanity checks');
test('AlternateRows component', function() {
    deepEqual(typeof altRows, 'object', 'AlternateRows instanciated');
    deepEqual(altRows.evenCss, 'even', 'Expected even css class');
    deepEqual(altRows.oddCss, 'odd', 'Expected odd css class');
});

module('Feature interface');
test('Properties', function() {
    deepEqual(
        altRows.tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(altRows.feature, 'alternateRows', 'Feature name');
    deepEqual(altRows.enabled, true, 'Feature enabled');
    deepEqual(altRows.initialized, true, 'Feature enabled');
    deepEqual(typeof altRows.emitter, 'object', 'Feature has emitter instance');
    deepEqual(typeof altRows.config, 'object', 'TF configuration object');
    deepEqual(typeof altRows.init, 'function', 'Feature init method');
    deepEqual(typeof altRows.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof altRows.reset, 'function', 'Feature reset method');
    deepEqual(typeof altRows.enable, 'function', 'Feature enable method');
    deepEqual(typeof altRows.disable, 'function', 'Feature enable method');
    deepEqual(
        typeof altRows.isEnabled, 'function', 'Feature enable method');
});
test('Can destroy', function() {
    altRows.destroy();
    deepEqual(altRows.initialized, false, 'not initialised');
    deepEqual(
        altRows.emitter.events['row-processed'].length,
        0,
        '`row-processed` event handler removed'
    );
    deepEqual(
        altRows.emitter.events['row-paged'].length,
        0,
        '`row-paged` event handler removed'
    );
    deepEqual(
        altRows.emitter.events['column-sorted'].length,
        0,
        '`column-sorted` event handler removed'
    );
    deepEqual(
        altRows.emitter.events['rows-changed'].length,
        0,
        '`rows-changed` event handler removed'
    );
});
test('Can reset', function() {
    altRows.reset();
    deepEqual(altRows.enabled, true, 'enabled');
});
test('Can disable', function() {
    altRows.disable();
    deepEqual(altRows.enabled, false, 'disabled');
});
test('Can enable', function() {
    altRows.enable();
    deepEqual(altRows.enabled, true, 'enabled');
});
test('Can init', function() {
    altRows.destroy();
    altRows.enable();
    altRows.init();
    deepEqual(altRows.enabled, true, 'enabled');
});
test('Can check is enabled', function() {
    altRows.isEnabled();
    deepEqual(altRows.enabled, true, 'enabled');
});

module('Actions');
test('Filter column', function() {
    tf.setFilterValue(2, '>1400');
    tf.filter();

    deepEqual(tbl.querySelectorAll('tr.odd').length, 2, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 2, 'Even bg removed');
});

test('Clear filters', function() {
    tf.clearFilters();
    tf.filter();

    deepEqual(tbl.querySelectorAll('tr.odd').length, 3, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 4, 'Even bg removed');
});

test('Set background on a row', function() {
    altRows.setRowBg(4);
    deepEqual(tbl.rows[4].className, 'odd', 'Bg set on expected row');
});

test('Remove background on a row', function() {
    altRows.removeRowBg(4);
    deepEqual(tbl.rows[4].querySelectorAll('.odd').length,
        0, 'Bg set on expected row');
});

test('Cannot init if initialised', function() {
    // setup
    var processAll = altRows.processAll;
    var hit = 0;
    altRows.processAll = function() { hit++ };
    altRows.initialized = true;

    // act
    altRows.init();

    // assert
    deepEqual(hit, 0, 'processAll not called');

    altRows.processAll = processAll;
});

test('Cannot processAll if not enabled', function() {
    // setup
    var setRowBg = altRows.setRowBg;
    var hit = 0;
    altRows.setRowBg = function() { hit++ };
    altRows.enabled = false;

    // act
    altRows.processAll();

    // assert
    deepEqual(hit, 0, 'setRowBg not called');

    altRows.setRowBg = setRowBg;
});

test('Cannot setRowBg if not enabled', function() {
    // setup
    var removeRowBg = altRows.removeRowBg;
    var hit = 0;
    altRows.removeRowBg = function() { hit++ };
    altRows.enabled = false;

    // act
    altRows.setRowBg(3, 5);

    // assert
    deepEqual(hit, 0, 'removeRowBg not called');

    altRows.removeRowBg = removeRowBg;
});

test('Cannot removeRowBg if row index is NaN', function() {
    // setup
    tf.clearFilters();
    tf.filter();

    // act
    altRows.removeRowBg('hello');

    // assert
    deepEqual(tbl.querySelectorAll('tr.odd').length, 3, 'Expected odd bgs');
    deepEqual(tbl.querySelectorAll('tr.even').length, 3, 'Expected even bgs');
});

test('Cannot destroy if not initialised', function() {
    // setup
    var getRowsNb = altRows.tf.getRowsNb;
    var hit = 0;
    altRows.tf.getRowsNb = function() { hit++ };
    altRows.initialized = false;

    // act
    altRows.destroy();

    // assert
    deepEqual(hit, 0, 'tf.getRowsNb not called');

    altRows.tf.getRowsNb = getRowsNb;
});

test('Remove alternating rows', function() {
    // setup
    altRows.initialized = true;

    // act
    altRows.destroy();

    // assert
    deepEqual(tbl.querySelectorAll('tr.odd').length, 0, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 0, 'Even bg removed');
});

module('Events');
test('Can handle `row-processed` event', function() {
    // setup
    var processRow = altRows.processRow;
    var hit = 0;
    var args;
    altRows.processRow = function() {
        args = [].slice.call(arguments);
        hit++;
    };

    // act
    altRows.init();
    tf.emitter.emit('row-processed', tf, 1, 0, true);

    // assert
    deepEqual(hit, 1, 'processRow called');
    deepEqual(args[0], 1, 'processRow called with expected row index');
    deepEqual(args[1], 0, 'processRow called with expected array index');
    deepEqual(args[2], true, 'processRow called with expected isValid value');

    altRows.processRow = processRow;
});

test('Can handle `row-paged` event', function() {
    // setup
    var processRow = altRows.processRow;
    var hit = 0;
    var args;
    altRows.processRow = function() {
        args = [].slice.call(arguments);
        hit++;
    };

    // act
    altRows.init();
    tf.emitter.emit('row-paged', tf, 1, 0, true);

    // assert
    deepEqual(hit, 1, 'processRow called');
    deepEqual(args[0], 1, 'processRow called with expected row index');
    deepEqual(args[1], 0, 'processRow called with expected array index');
    deepEqual(args[2], true, 'processRow called with expected isValid value');

    altRows.processRow = processRow;
});

test('Can handle `column-sorted` event', function() {
    // setup
    var processAll = altRows.processAll;
    var hit = 0;
    altRows.processAll = function() {
        hit++;
    };

    // act
    altRows.init();
    tf.emitter.emit('column-sorted');

    // assert
    deepEqual(hit, 1, 'processAll called');

    altRows.processAll = processAll;
});

test('Can handle `rows-changed` event', function() {
    // setup
    var processAll = altRows.processAll;
    var hit = 0;
    altRows.processAll = function() {
        hit++;
    };

    // act
    altRows.init();
    tf.emitter.emit('rows-changed');

    // assert
    deepEqual(hit, 1, 'processAll called');

    altRows.processAll = processAll;
});

module('Grid layout');
test('Grid layout: initialising alternating rows', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        alternate_rows: true
    });
    tf.init();
    tbl = tf.tbl;
    altRows = tf.feature('alternateRows');

    deepEqual(
      tbl.querySelectorAll('tr.odd').length, 4, 'Expected bg for odd rows');
    deepEqual(
     tbl.querySelectorAll('tr.even').length, 3, 'Expected bg for even rows');
});

test('Grid layout: filter column', function() {
    tf.setFilterValue(3, '<2');
    tf.filter();

    deepEqual(tbl.querySelectorAll('tr.odd').length, 2, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 2, 'Even bg removed');
});

test('Grid layout: clear filters', function() {
    tf.clearFilters();
    tf.filter();

    deepEqual(tbl.querySelectorAll('tr.odd').length, 3, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 4, 'Even bg removed');
});

test('Grid layout: set background on a row', function() {
    altRows.setRowBg(4);
    deepEqual(tbl.rows[4].className, 'odd', 'Bg set on expected row');
});

test('Grid layout: remove background on a row', function() {
    altRows.removeRowBg(4);
    deepEqual(tbl.rows[4].querySelectorAll('.odd').length,
        0, 'Bg set on expected row');
});

test('Grid layout: remove alternating rows', function() {
    altRows.destroy();
    deepEqual(tbl.querySelectorAll('tr.odd').length, 0, 'Odd bgs removed');
    deepEqual(tbl.querySelectorAll('tr.even').length, 0, 'Even bg removed');
});

module('Fixes');
// Issue 365: alternating rows with column sorted at start
test('Sort: alternating rows with column sorted at start', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        alternate_rows: true,
        extensions:[{
            name: 'sort',
            sort_col_at_start: [2, true],
            on_sort_loaded: checkAlternateRows
        }]
    });
    tf.init();
    altRows = tf.feature('alternateRows');

    deepEqual(typeof altRows, 'object', 'AlternateRows instanciated');
    deepEqual(altRows.evenCss, 'even', 'Expected even css class');
    deepEqual(altRows.oddCss, 'odd', 'Expected odd css class');

    function checkAlternateRows(tf) {
        tbl = tf.tbl;
        altRows = tf.feature('alternateRows');

        test('Alternate rows with sort column at start option', function() {
            deepEqual(
                tbl.rows[2].classList.contains('odd'),
                true,
                'Expected bg for rows[2]'
            );
            deepEqual(
                tbl.rows[5].classList.contains('even'),
                true,
                'Expected bg for rows[5]'
            );
        });
    }
});
