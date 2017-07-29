
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    paging: true,
    paging_length: 2,
    results_per_page: ['Results per page ', [2, 4, 6]]
});
tf.init();

var paging = tf.feature('paging');
module('Sanity checks');
test('Paging component', function() {
    notEqual(paging, null, 'Paging instanciated');
    deepEqual(paging.pagingLength, 2, 'Paging length');
    deepEqual(paging.nbPages, 4, 'Number of pages');
});
module('Feature interface');
test('Properties', function() {
    deepEqual(
        paging.tf instanceof TableFilter, true, 'TableFilter instance');
    deepEqual(paging.feature, 'paging', 'Feature name');
    deepEqual(paging.enabled, true, 'Feature enabled');
    deepEqual(paging.initialized, true, 'Feature enabled');
    deepEqual(typeof paging.emitter, 'object', 'Feature has emitter instance');
    deepEqual(typeof paging.config, 'object', 'TF configuration object');
    deepEqual(typeof paging.init, 'function', 'Feature init method');
    deepEqual(typeof paging.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof paging.reset, 'function', 'Feature reset method');
    deepEqual(typeof paging.enable, 'function', 'Feature enable method');
    deepEqual(typeof paging.disable, 'function', 'Feature enable method');
    deepEqual(
        typeof paging.isEnabled, 'function', 'Feature enable method');
});
test('Can destroy', function() {
    paging.destroy();
    deepEqual(paging.enabled, false, 'disabled');
});
test('Can reset', function() {
    paging.reset();
    deepEqual(paging.enabled, true, 'enabled');
});
test('Can disable', function() {
    paging.disable();
    deepEqual(paging.enabled, false, 'disabled');
});
test('Can enable', function() {
    paging.enable();
    deepEqual(paging.enabled, true, 'enabled');
});
test('Can init', function() {
    paging.destroy();
    paging.enable();
    paging.init();
    deepEqual(paging.enabled, true, 'enabled');
});
test('Can check is enabled', function() {
    paging.isEnabled();
    deepEqual(paging.enabled, true, 'enabled');
});

module('UI elements');
test('Paging UI elements', function() {
    notEqual(paging.pagingSlc, null, 'Paging drop-down element');
    notEqual(paging.resultsPerPageSlc, null,
        'Number of results per page drop-down element');
    notEqual(paging.btnNextCont, null, 'Next button container element');
    notEqual(paging.btnPrevCont, null, 'Previous button container element');
    notEqual(paging.btnLastCont, null, 'Last button container element');
    notEqual(paging.btnFirstCont, null, 'First button container element');
});

test('Destroy Paging component', function() {
    paging.destroy();
    deepEqual(paging.pagingSlc, null, 'Paging drop-down element');
    deepEqual(paging.resultsPerPageSlc, null, 'Paging drop-down element');
    deepEqual(paging.btnNextCont, null, 'Next button container element');
    deepEqual(paging.btnPrevCont, null, 'Previous button container element');
    deepEqual(paging.btnLastCont, null, 'Last button container element');
    deepEqual(paging.btnFirstCont, null, 'First button container element');
    deepEqual(paging.nbPages, 0, 'Number of pages');
});

test('Reset Paging component', function() {
    paging.reset();
    paging.setPage(2);
    notEqual(paging.pagingSlc, null, 'Paging drop-down element');
});

module('Behaviour');
test('Set page', function() {
    paging.setPage(1);
    deepEqual(paging.getPage(), 1, 'Expected page number');
    paging.setPage(3);
    deepEqual(paging.getPage(), 3, 'Expected page number');
    deepEqual(paging.pagingSlc.selectedIndex, 2,
        'Expected page number in paging drop-down selector');
});

test('Set page via drop-down page selector', function() {
    paging.pagingSlc.selectedIndex = 3;
    paging.changePage(paging.pagingSlc.selectedIndex);
    deepEqual(paging.getPage(), 4, 'Expected page number');
});

test('Filter from non starting page', function() {
    tf.setFilterValue(1, 'Melbourne');
    tf.filter();
    deepEqual(tf.validRowsIndex.length,
        1, 'Expected valid rows after page change');
    deepEqual(tf.getValidRowsNb(),
        1, 'Expected visible rows after page change');
});

test('Filter with dummy value', function() {
    tf.clearFilters();
    tf.setFilterValue(0, 'dfsdf');
    tf.filter();
    deepEqual(tf.validRowsIndex.length, 0, 'Expected valid rows');
});

test('Set results per page', function() {
    tf.clearFilters();
    paging.changeResultsPerPage('4');
    deepEqual(paging.pagingLength, 4, 'Expected page length');
    deepEqual(paging.nbPages, 2, 'Expected number of pages');
    paging.changeResultsPerPage('6');
    deepEqual(paging.pagingLength, 6, 'Expected page length');
    deepEqual(paging.nbPages, 2, 'Expected number of pages');
});

module('Grid layout');
test('Grid layout with paging', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        paging: true,
        paging_length: 2,
        results_per_page: ['Results per page ', [2,4,6]]
    });
    tf.init();

    paging = tf.feature('paging');

    notEqual(paging.pagingSlc, null, 'Paging drop-down element');
    notEqual(paging.resultsPerPageSlc, null,
        'Number of results per page drop-down element');
    notEqual(paging.btnNextCont, null, 'Next button container element');
    notEqual(paging.btnPrevCont, null, 'Previous button container element');
    notEqual(paging.btnLastCont, null, 'Last button container element');
    notEqual(paging.btnFirstCont, null, 'First button container element');
});

module('Behaviour');
test('Set page', function() {
    paging.setPage(1);
    deepEqual(paging.getPage(), 1, 'Expected page number');
    paging.setPage(3);
    deepEqual(paging.getPage(), 3, 'Expected page number');
});

test('Set page via drop-down page selector', function() {
    paging.pagingSlc.selectedIndex = 3;
    paging.changePage(paging.pagingSlc.selectedIndex);
    deepEqual(paging.getPage(), 4, 'Expected page number');
});

test('Filter from non starting page', function() {
    tf.setFilterValue(1, 'Perth');
    tf.filter();
    deepEqual(tf.validRowsIndex.length,
        1, 'Expected valid rows after page change');
    deepEqual(tf.getValidRowsNb(),
        1, 'Expected visible rows after page change');
});

test('Filter with dummy value', function() {
    tf.clearFilters();
    tf.setFilterValue(0, 'dfsdf');
    tf.filter();
    deepEqual(tf.validRowsIndex.length, 0, 'Expected valid rows');
});

test('Set results per page', function() {
    tf.clearFilters();
    paging.changeResultsPerPage('4');
    deepEqual(paging.pagingLength, 4, 'Expected page length');
    deepEqual(paging.nbPages, 2, 'Expected number of pages');
    paging.changeResultsPerPage('6');
    deepEqual(paging.pagingLength, 6, 'Expected page length');
    deepEqual(paging.nbPages, 2, 'Expected number of pages');
});

module('Reset feature');
test('can destroy and init TableFilter', function() {
    tf.destroy();
    tf.init();
    notEqual(paging, null, 'Paging instanciated');
    deepEqual(paging.pagingLength, 2, 'Paging length');
    deepEqual(paging.nbPages, 4, 'Number of pages');
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
