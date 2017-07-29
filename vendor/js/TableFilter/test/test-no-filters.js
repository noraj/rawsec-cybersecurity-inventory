(function(win, TableFilter){

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid: false
    });
    tf.init();

    module('Sanity checks');
    test('No filters', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
        deepEqual(tf.fltGrid, false, 'fltGrid property set false');
        deepEqual(tf.getFilterElement(0), null,
            'No filter element for column 0');
        deepEqual(tf.refRow, 1, 'Reference row index');
    });
    test('cannot filter table', function() {
        // setup
        var ct = 0;
        tf.emitter.on(['before-filtering'], function() {
            ct++;
        });

        // act
        tf.filter();

        // assert
        deepEqual(ct, 0, 'Table not filtered');
    });
    test('cannot getFilterVlue', function() {
        // act
        var filterValue = tf.getFilterValue(1);

        // assert
        deepEqual(filterValue, undefined, 'Returned filter value: undefined');
    });
    test('cannot getFiltersValue', function() {
        // act
        var filtersValue = tf.getFiltersValue();

        // assert
        deepEqual(filtersValue, undefined, 'Returned filter values: undefined');
    });
    test('cannot getFilterId', function() {
        // act
        var filterId = tf.getFilterId(0);

        // assert
        deepEqual(filterId, undefined, 'Returned filter ID: undefined');
    });
    test('cannot getFiltersByType', function() {
        // act
        var filters = tf.getFiltersByType('input');

        // assert
        deepEqual(filters, undefined, 'Returned filters ID: undefined');
    });
    test('cannot setFilterValue', function() {
        // setup
        var getFilterElement = tf.getFilterElement;
        var ct = 0;
        tf.getFilterElement = function(){
            ct++;
        };

        // act
        tf.setFilterValue(1, 'hello');

        // assert
        deepEqual(ct, 0, 'getFilterElement method not called');

        tf.getFilterElement = getFilterElement;
    });
    test('cannot clearFilters', function() {
        // setup
        var ct = 0;
        tf.emitter.on(['before-clearing-filters'], function() {
            ct++;
        });

        // act
        tf.clearFilters();

        // assert
        deepEqual(ct, 0, 'Filters not cleared');
    });

    test('cannot _initNoFilters if there are filters', function() {
        // setup
        tf.fltGrid = true;
        var getRowsNb = this.getRowsNb;
        var ct = 0;
        tf.getRowsNb = function(){
            ct++;
        };

        // act
        tf._initNoFilters();

        // assert
        deepEqual(ct, 0, '_initNoFilters not executed');

        tf.getRowsNb = getRowsNb;
    });

    module('Paging on');
    test('Paging with no filters', function() {
        // setup
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            grid: false,
            paging: true,
            paging_length: 3
        });
        var ct = 0;
        tf.emitter.on(['row-validated'], function() {
            ct++;
        });

        // act
        tf.init();
        deepEqual(tf.getFilterElement(4), null,
            'No filter element for column 4');

        // assert
        deepEqual(tf.fltGrid, false, 'fltGrid property set false');
        deepEqual(tf.refRow, 1, 'Reference row index');
        deepEqual(ct, 0, 'tf.validateAllRows not called on Paging init');
    });

    module('Grid-layout on');
    test('Grid layout with no filters', function() {
        // setup
        tf.destroy();
        tf = null;
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            grid_enable_default_filters: false,
            col_width: ['100px','100px','100px','100px','100px'],
            grid_layout: true
        });

        // act
        tf.init();

        // assert
        deepEqual(tf.fltGrid, false, 'fltGrid property set false');
        deepEqual(tf.getFilterElement(2), null,
            'No filter element for column 2');
        deepEqual(tf.refRow, 0, 'Reference row index');

        tf.setFilterValue(1, 'Bris');
        deepEqual(tf.getValidRows().length, 0,
            'does not fail on setFilterValue');

        // act
        var filtersRow = tf.feature('gridLayout').createFiltersRow();

        // assert
        deepEqual(filtersRow.cells.length, 0, 'Filters row is empty');
    });

    module('Tear-down');
    test('TableFilter removed', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Filters removed');
    });

})(window, TableFilter);
