
var id = function (id){ return document.getElementById(id); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_2: 'select',
    col_3: 'multiple',
    col_4: 'checklist',
    /* external filters */
    external_flt_grid: true,
    external_flt_grid_ids: [
        'extFrom',
        'extDestination',
        'extRoadDistance',
        'extAirDistance',
        'extRailDistance'
    ]
});
tf.init();

module('Sanity checks');
test('External filters', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.isExternalFlt, true, 'Has external filters');
    deepEqual(tf.externalFltTgtIds.length, 5,
        'External filters ids length');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 1, 'Headers row index');
    deepEqual(tf.getStartRowIndex(), 2, 'Reference row index');
    deepEqual(id('extFrom').childNodes.length>0, true,
        'Col0 filter is external');
    deepEqual(id('extDestination').childNodes.length>0, true,
        'Col1 filter is external');
    deepEqual(id('extRoadDistance').childNodes.length>0, true,
        'Col2 filter is external');
    deepEqual(id('extAirDistance').childNodes.length>0, true,
        'Col3 filter is external');
    deepEqual(id('extRailDistance').childNodes.length>0, true,
        'Col4 filter is external');
});

module('Filter columns');
test('Can filter column 0', function() {
    tf.setFilterValue(0, 'Syd');
    tf.filter();
    deepEqual(tf.getValidRows().length, 4, 'Filtered rows length');
});
test('Can filter column 1', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Ade');
    tf.filter();
    deepEqual(tf.getValidRows(), [2], 'Filtered rows');
});
test('Can filter column 2', function() {
    tf.clearFilters();
    tf.setFilterValue(2, '1533');
    tf.filter();
    deepEqual(tf.getValidRows(), [7], 'Filtered rows');
});
test('Can filter column 3', function() {
    tf.clearFilters();
    tf.setFilterValue(3, ['2', '3.1', '1.5']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Filtered rows');
});
test('Can filter column 4', function() {
    tf.clearFilters();
    tf.setFilterValue(4, ['16', '40']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows');
});

// Filters in grid-layout mode are already considered as `external` as
// generated in headers container
module('Grid-layout');
test('Sanity checks', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_2: 'select',
        col_3: 'multiple',
        col_4: 'checklist',
        /* external filters */
        external_flt_grid: true,
        external_flt_grid_ids: [
            'extFrom',
            'extDestination',
            'extRoadDistance',
            'extAirDistance',
            'extRailDistance'
        ],
        grid_layout: true
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.isExternalFlt, true, 'Has external filters');
    deepEqual(tf.externalFltTgtIds.length, 5,
        'External filters ids length');
    deepEqual(tf.getFiltersRowIndex(), 1, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 0, 'Headers row index');
    deepEqual(tf.getStartRowIndex(), 0, 'Reference row index');
    deepEqual(id('extFrom').childNodes.length, 0,
        'Col0 filter is external');
    deepEqual(id('extDestination').childNodes.length, 0,
        'Col1 filter is external');
    deepEqual(id('extRoadDistance').childNodes.length, 0,
        'Col2 filter is external');
    deepEqual(id('extAirDistance').childNodes.length, 0,
        'Col3 filter is external');
    deepEqual(id('extRailDistance').childNodes.length, 0,
        'Col4 filter is external');
});
test('Can filter column 0', function() {
    tf.setFilterValue(0, 'Syd');
    tf.filter();
    deepEqual(tf.getValidRows().length, 4, 'Filtered rows length');
});
test('Can filter column 1', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Ade');
    tf.filter();
    deepEqual(tf.getValidRows(), [0], 'Filtered rows');
});
test('Can filter column 2', function() {
    tf.clearFilters();
    tf.setFilterValue(2, '1533');
    tf.filter();
    deepEqual(tf.getValidRows(), [5], 'Filtered rows');
});
test('Can filter column 3', function() {
    tf.clearFilters();
    tf.setFilterValue(3, ['2', '3.1', '1.5']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Filtered rows');
});
test('Can filter column 4', function() {
    tf.clearFilters();
    tf.setFilterValue(4, ['16', '40']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows');
});

// In popup filters mode are already considered as `external` as
// generated in headers container
module('Pop-up filters');
test('Sanity checks', function() {
    tf.clearFilters();
    tf.destroy();
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_2: 'select',
        col_3: 'multiple',
        col_4: 'checklist',
        /* external filters */
        external_flt_grid: true,
        external_flt_grid_ids: [
            'extFrom',
            'extDestination',
            'extRoadDistance',
            'extAirDistance',
            'extRailDistance'
        ],
        popup_filters: true
    });
    tf.init();

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.isExternalFlt, true, 'Has external filters');
    deepEqual(tf.externalFltTgtIds.length, 5,
        'External filters ids length');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 1, 'Headers row index');
    deepEqual(tf.getStartRowIndex(), 2, 'Reference row index');
    deepEqual(id('extFrom').childNodes.length, 0,
        'Col0 filter is external');
    deepEqual(id('extDestination').childNodes.length, 0,
        'Col1 filter is external');
    deepEqual(id('extRoadDistance').childNodes.length, 0,
        'Col2 filter is external');
    deepEqual(id('extAirDistance').childNodes.length, 0,
        'Col3 filter is external');
    deepEqual(id('extRailDistance').childNodes.length, 0,
        'Col4 filter is external');
});
test('Can filter column 0', function() {
    tf.setFilterValue(0, 'Syd');
    tf.filter();
    deepEqual(tf.getValidRows().length, 4, 'Filtered rows length');
});
test('Can filter column 1', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Ade');
    tf.filter();
    deepEqual(tf.getValidRows(), [2], 'Filtered rows');
});
test('Can filter column 2', function() {
    tf.clearFilters();
    tf.setFilterValue(2, '1533');
    tf.filter();
    deepEqual(tf.getValidRows(), [7], 'Filtered rows');
});
test('Can filter column 3', function() {
    tf.clearFilters();
    tf.setFilterValue(3, ['2', '3.1', '1.5']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Filtered rows');
});
test('Can filter column 4', function() {
    tf.clearFilters();
    tf.setFilterValue(4, ['16', '40']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows');
});

module('Tear-down');
test('TableFilter removed', function() {
    tf.clearFilters();
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
