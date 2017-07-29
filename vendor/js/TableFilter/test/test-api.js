
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_types: ['string', 'string', 'number', 'number', 'number']
});
tf.init();

var tf1 = new TableFilter('demo1', {
    base_path: '../dist/tablefilter/',
    col_types: ['string', 'string', 'number', 'number', 'number'],
    extensions: [{
        name: 'colsVisibility',
        at_start: [1, 2],
        on_loaded: colsVisibilityTests
    }]
});
tf1.init();

module('Sanity checks');
test('TableFilter object', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
    deepEqual(tf.id, 'demo', 'id check');
    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 1, 'Headers row index');
    deepEqual(tf.getCellsNb(), 5, 'Cells collection length');
    deepEqual(tf.getRowsNb(), 7, 'Rows collection length');
    deepEqual(tf.getFilterableRowsNb(), 7, 'Number of filterable rows');
    deepEqual(tf.getFilterId(0), 'flt0_demo', 'Filter DOM element id');
    deepEqual(tf.getStartRowIndex(), 2, 'Start of filterable rows');
    deepEqual(tf.getLastRowIndex(), 8, 'Last row index');
    deepEqual(
        tf.getHeadersText(),
        [
            'From','Destination','Road Distance (km)', 'By Air (hrs)',
            'By Rail (hrs)'
        ],
        'Headers text');
    deepEqual(
        tf.getCellValue(tf.getHeaderElement(1)),
        'Destination',
        'Column header text'
    );
    deepEqual(tf.getValidRowsNb(), 0, 'Number of valid rows before filtering');
    deepEqual(
        tf.getCellData(tf.tbl.rows[3].cells[2]),
        982,
        'getCellData returns typed value'
    );
});

module('Public methods');
test('Filters DOM elements', function() {
    deepEqual(tf.getFilterElement(1).nodeName, 'INPUT',
        'Filter\'s DOM element');
    deepEqual(tf.getHeaderElement(2).nodeName, 'TH',
        'Header\'s DOM element');
});

test('Get filters values', function() {
    equal(tf.getFilterValue(0), '', 'Column 0 filter value');
    tf.setFilterValue(0, 'Syd');
    tf.setFilterValue(1, 'Ade');
    deepEqual(tf.getFilterValue(0), 'Syd', 'Column 0 filter value');
    deepEqual(tf.getFiltersValue(), ['Syd', 'Ade', '', '', '']);
});

test('Filter table', function() {
    tf.clearFilters();
    deepEqual(tf.getFilterValue(0), '',
        'Column 0 filter value after clearing filters');
    tf.setFilterValue(0, 'Syd');
    tf.filter();
    deepEqual(tf.getValidRowsNb(), 4, 'Filtered rows number');
});

test('Filter table with range', function() {
    tf.clearFilters();
    tf.setFilterValue(2, '>1500 && <=2871');
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Filtered rows number');
});

test('Filter table with operator', function() {
    tf.clearFilters();
    tf.setFilterValue(1, '{Bri');
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows number');
});

test('Get active filter ID', function() {
    //setup
    tf.getFilterElement(0).focus();

    //act
    var id = tf.getActiveFilterId();

    //assert
    deepEqual(id, 'flt0_demo', 'Active filter ID');
});

test('Set active filter ID', function() {
    //act
    tf.setActiveFilterId('hello');

    //assert
    deepEqual(tf.getActiveFilterId(), 'hello', 'Active filter ID');
});

test('Get column index from filter ID', function() {
    //set
    var filterId = 'flt3_demo';

    //act
    var colIndex = tf.getColumnIndexFromFilterId(filterId);

    //assert
    deepEqual(colIndex, 3, 'Column index');
});

test('Activate filter for a specified column', function() {
    //set
    var filterId = 'flt3_demo';

    //act
    tf.activateFilter(3);

    //assert
    deepEqual(tf.getActiveFilterId(), filterId, 'Filter active');
});

test('Clear filters', function() {
    tf.clearFilters();
    deepEqual(tf.getValidRowsNb(), 7, 'Filtered rows number');
    deepEqual(tf.getFiltersValue(), ['', '', '', '', '']);
});

test('Can get feature', function() {
    var feature = tf.feature('help');
    deepEqual(typeof feature, 'object', 'Feature instance');
    deepEqual(feature.feature, 'help', 'Feature name');
});

test('Get table data', function() {
    deepEqual(tf.getColValues(0),
        [
            'Sydney','Sydney','Sydney',
            'Sydney','Adelaide','Adelaide','Adelaide'
        ],
        'Get specified column values'
    );
    deepEqual(tf.getColValues(0, true),
        [
            'From','Sydney','Sydney','Sydney',
            'Sydney','Adelaide','Adelaide','Adelaide'
        ],
        'Get specified column values including column header'
    );
    deepEqual(
        tf.getColValues(2, false, true),
        [1412,982,286,872,2781,1533,2045],
        'Get specified column typed values'
    );
    deepEqual(
        tf.getTableData(),
        [
            [2, ['Sydney','Adelaide','1412','1.4','25.3']],
            [3, ['Sydney','Brisbane','982','1.5','16']],
            [4, ['Sydney','Canberra','286','.6','4.3']],
            [5, ['Sydney','Melbourne','872','1.1','10.5']],
            [6, ['Adelaide','Perth','2781','3.1','38']],
            [7, ['Adelaide','Alice Springs','1533','2','20.25']],
            [8, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get table data'
    );
    deepEqual(
        tf.getTableData(true),
        [
            [1, ['From','Destination','Road Distance (km)',
                'By Air (hrs)','By Rail (hrs)']],
            [2, ['Sydney','Adelaide','1412','1.4','25.3']],
            [3, ['Sydney','Brisbane','982','1.5','16']],
            [4, ['Sydney','Canberra','286','.6','4.3']],
            [5, ['Sydney','Melbourne','872','1.1','10.5']],
            [6, ['Adelaide','Perth','2781','3.1','38']],
            [7, ['Adelaide','Alice Springs','1533','2','20.25']],
            [8, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get table data including columns headers'
    );
    deepEqual(
        tf.getTableData(false, false, true),
        [
            [2, ['Sydney','Adelaide',1412,1.4,25.3]],
            [3, ['Sydney','Brisbane',982,1.5,16]],
            [4, ['Sydney','Canberra',286,0.6,4.3]],
            [5, ['Sydney','Melbourne',872,1.1,10.5]],
            [6, ['Adelaide','Perth',2781,3.1,38]],
            [7, ['Adelaide','Alice Springs',1533,2,20.25]],
            [8, ['Adelaide','Brisbane',2045,2.15,40]]
        ],
        'Get table typed data'
    );
    tf.setFilterValue(0, 'Adelaide');
    tf.filter();
    deepEqual(
        tf.getFilteredData(),
        [
            [6, ['Adelaide','Perth','2781','3.1','38']],
            [7, ['Adelaide','Alice Springs','1533','2','20.25']],
            [8, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get filtered table data'
    );
    deepEqual(
        tf.getFilteredData(true),
        [
            [1, ['From','Destination','Road Distance (km)',
                'By Air (hrs)','By Rail (hrs)']],
            [6, ['Adelaide','Perth','2781','3.1','38']],
            [7, ['Adelaide','Alice Springs','1533','2','20.25']],
            [8, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get filtered table data including columns headers'
    );
    deepEqual(
        tf.getFilteredData(false, false, true),
        [
            [6, ['Adelaide','Perth',2781,3.1,38]],
            [7, ['Adelaide','Alice Springs',1533,2,20.25]],
            [8, ['Adelaide','Brisbane',2045,2.15,40]]
        ],
        'Get filtered typed data'
    );
    deepEqual(
        tf.getFilteredDataCol(0),
        ['Adelaide','Adelaide','Adelaide'],
        'Get specified column filtered values'
    );
    deepEqual(
        tf.getFilteredDataCol(0, true),
        ['From','Adelaide','Adelaide','Adelaide'],
        'Get specified column filtered values including header'
    );
    deepEqual(
        tf.getFilteredDataCol(2, false, true),
        [2781,1533,2045],
        'Get specified column filtered typed values'
    );
    tf.clearFilters();
    tf.filter();
});

test('Destroy', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
    tf = null;
});

module('TableFilter instance with different filter types');
test('Test filter types', function() {
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_0: 'select',
        col_1: 'multiple',
        col_2: 'checklist'
    });
    tf.init();

    deepEqual(tf.getFilterType(0), 'select', 'Colmun 0 filter type');
    deepEqual(tf.getFilterType(1), 'multiple', 'Colmun 1 filter type');
    deepEqual(tf.getFilterType(2), 'checklist', 'Colmun 2 filter type');
    deepEqual(tf.getFilterType(3), 'input', 'Colmun 3 filter type');
    deepEqual(tf.getFiltersByType('select'), ['flt0_demo'],
        'Get select filter(s)');
    deepEqual(tf.getFiltersByType('multiple'), ['flt1_demo'],
        'Get multiple filter(s)');
    deepEqual(tf.getFiltersByType('checklist'), ['flt2_demo'],
        'Get checklist filter(s)');
    deepEqual(tf.getFiltersByType('input'), ['flt3_demo','flt4_demo'],
        'Get input filter(s)');
});

test('Get filters values', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.setFilterValue(1, 'Adelaide');
    deepEqual(tf.getFilterValue(0), 'Sydney', 'Column 0 filter value');
    deepEqual(tf.getFiltersValue(),
        ['Sydney', ['Adelaide'], '', '', '']);
});

test('Filter table', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Alice Springs');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Filtered rows number');
});

test('Can filter table with multiple filter', function() {
    tf.clearFilters();
    tf.setFilterValue(1, ['Alice Springs', 'Canberra']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows number');
});

test('Can filter table with checklist filter', function() {
    tf.clearFilters();
    tf.setFilterValue(2, ['2045', '2781']);
    tf.filter();
    deepEqual(tf.getValidRows().length, 2, 'Filtered rows number');
});

test('Can select dropdown options with or operator', function() {
    tf.setFilterValue(1, '');
    tf.setFilterValue(1, 'Brisbane || Melbourne');

    deepEqual(tf.getFilterValue(1), ['Brisbane', 'Melbourne'],
        'Column 2 filter values');
});

test('Can select dropdown options with array', function() {
    tf.setFilterValue(1, '');
    tf.setFilterValue(1, ['Canberra', 'Perth']);

    deepEqual(tf.getFilterValue(1), ['Canberra', 'Perth'],
        'Column 2 filter values');
});

test('Can select checklist options', function() {
    tf.setFilterValue(2, '2045 || 2781');

    deepEqual(tf.getFilterValue(2), ['2045', '2781'],
        'Column 2 filter values');
});

test('Can select checklist options with array', function() {
    tf.setFilterValue(2, '');
    tf.setFilterValue(2, ['1412', '982']);

    deepEqual(tf.getFilterValue(2), ['1412', '982'],
        'Column 2 filter values');
});

module('TableFilter with pop-up filters');
test('Sanity checks', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        popup_filters: true
    });
    tf.init();

    deepEqual(tf.getFiltersRowIndex(), 0, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 1, 'Headers row index');
    deepEqual(tf.getFilterElement(1).nodeName, 'INPUT',
        'Filter\'s DOM element');
    deepEqual(tf.getHeaderElement(2).nodeName, 'TH',
        'Header\'s DOM element');
});

test('Get filters values', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.setFilterValue(1, 'Adelaide');
    deepEqual(tf.getFilterValue(0), 'Sydney', 'Column 0 filter value');
    deepEqual(tf.getFiltersValue(), ['Sydney', 'Adelaide', '', '', '']);
});

// Test case for issue 165
test('Test getCellValue with white spaces', function() {
    // setup
    var cell = document.createElement('td');
    cell.textContent ='\t\thello world\t\t\t';

    // act
    var result = tf.getCellValue(cell);

    //assert
    deepEqual(result, 'hello world', 'Expected text with no white spaces');
});

test('Filter table', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Adelaide');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Filtered rows number');
});

module('TableFilter with grid-layout');
test('Sanity checks', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        col_0: 'select',
        col_1: 'multiple',
        col_2: 'checklist'
    });
    tf.init();

    deepEqual(tf.getFilterType(0), 'select', 'Colmun 0 filter type');
    deepEqual(tf.getFilterType(1), 'multiple', 'Colmun 1 filter type');
    deepEqual(tf.getFilterType(2), 'checklist', 'Colmun 2 filter type');
    deepEqual(tf.getFilterType(3), 'input', 'Colmun 3 filter type');
    deepEqual(tf.getFiltersByType('select'), ['flt0_demo'],
        'Get select filter(s)');
    deepEqual(tf.getFiltersByType('multiple'), ['flt1_demo'],
        'Get multiple filter(s)');
    deepEqual(tf.getFiltersByType('checklist'), ['flt2_demo'],
        'Get checklist filter(s)');
    deepEqual(tf.getFiltersByType('input'), ['flt3_demo','flt4_demo'],
        'Get input filter(s)');

    deepEqual(tf.getFiltersRowIndex(), 1, 'Filters row index');
    deepEqual(tf.getHeadersRowIndex(), 0, 'Headers row index');
    deepEqual(tf.getFilterElement(1).nodeName, 'SELECT',
        'Filter\'s DOM element');
    deepEqual(tf.getHeaderElement(2).nodeName, 'TH',
        'Header\'s DOM element');
});

test('Get filters values', function() {
    tf.setFilterValue(0, 'Sydney');
    tf.setFilterValue(1, 'Adelaide');
    deepEqual(tf.getFilterValue(0), 'Sydney', 'Column 0 filter value');
    deepEqual(tf.getFiltersValue(), ['Sydney', ['Adelaide'], '', '', '']);
});

test('Filter table', function() {
    tf.clearFilters();
    tf.setFilterValue(1, 'Adelaide');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Filtered rows number');
});

test('Clear filters', function() {
    tf.clearFilters();
    deepEqual(tf.getValidRowsNb(), 7, 'Filtered rows number');
    deepEqual(tf.getFiltersValue(), ['', '', '', '', '']);
});

test('Get table data', function() {
    deepEqual(tf.getColValues(0),
        [
            'Sydney','Sydney','Sydney',
            'Sydney','Adelaide','Adelaide','Adelaide'
        ],
        'Get specified column values'
    );
    deepEqual(tf.getColValues(0, true),
        [
            'From','Sydney','Sydney','Sydney',
            'Sydney','Adelaide','Adelaide','Adelaide'
        ],
        'Get specified column values including column header'
    );
    deepEqual(
        tf.getTableData(),
        [
            [0, ['Sydney','Adelaide','1412','1.4','25.3']],
            [1, ['Sydney','Brisbane','982','1.5','16']],
            [2, ['Sydney','Canberra','286','.6','4.3']],
            [3, ['Sydney','Melbourne','872','1.1','10.5']],
            [4, ['Adelaide','Perth','2781','3.1','38']],
            [5, ['Adelaide','Alice Springs','1533','2','20.25']],
            [6, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get table data'
    );
    tf.clearFilters();
    tf.setFilterValue(0, 'Adelaide');
    tf.filter();
    deepEqual(
        tf.getFilteredData(),
        [
            [4, ['Adelaide','Perth','2781','3.1','38']],
            [5, ['Adelaide','Alice Springs','1533','2','20.25']],
            [6, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get filtered table data'
    );
    deepEqual(
        tf.getFilteredData(true),
        [
            [0, ['From','Destination','Road Distance (km)',
                'By Air (hrs)','By Rail (hrs)']],
            [4, ['Adelaide','Perth','2781','3.1','38']],
            [5, ['Adelaide','Alice Springs','1533','2','20.25']],
            [6, ['Adelaide','Brisbane','2045','2.15','40']]
        ],
        'Get filtered table data including columns headers'
    );
    deepEqual(
        tf.getFilteredDataCol(0),
        ['Adelaide','Adelaide','Adelaide'],
        'Get specified column filtered values'
    );
    deepEqual(
        tf.getFilteredDataCol(0, true),
        ['From','Adelaide','Adelaide','Adelaide'],
        'Get specified column filtered values including header'
    );
    tf.clearFilters();
    tf.filter();
});

test('Destroy', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
    tf = null;
});

function colsVisibilityTests() { // issue 94
    module('Public methods with columns visibility extension');
    test('Sanity checks', function() {

        tf1.setFilterValue(0, 'Adelaide');
        tf1.filter();

        deepEqual(
            tf1.getFilteredData(false, true),
            [
                [6, ['Adelaide','3.1','38']],
                [7, ['Adelaide','2','20.25']],
                [8, ['Adelaide','2.15','40']]
            ],
            'Get filtered table data with excluded columns'
        );

        deepEqual(
            tf1.getFilteredData(true, true),
            [
                [1, ['From','By Air (hrs)','By Rail (hrs)']],
                [6, ['Adelaide','3.1','38']],
                [7, ['Adelaide','2','20.25']],
                [8, ['Adelaide','2.15','40']]
            ],
            'Get filtered table data with headers and excluded columns'
        );

        deepEqual(
            tf1.getTableData(false, true),
            [
                [2, ['Sydney','1.4','25.3']],
                [3, ['Sydney','1.5','16']],
                [4, ['Sydney','.6','4.3']],
                [5, ['Sydney','1.1','10.5']],
                [6, ['Adelaide','3.1','38']],
                [7, ['Adelaide','2','20.25']],
                [8, ['Adelaide','2.15','40']]
            ],
            'Get table data with excluded columns'
        );

        deepEqual(
            tf1.getTableData(true, true),
            [
                [1, ['From','By Air (hrs)','By Rail (hrs)']],
                [2, ['Sydney','1.4','25.3']],
                [3, ['Sydney','1.5','16']],
                [4, ['Sydney','.6','4.3']],
                [5, ['Sydney','1.1','10.5']],
                [6, ['Adelaide','3.1','38']],
                [7, ['Adelaide','2','20.25']],
                [8, ['Adelaide','2.15','40']]
            ],
            'Get table data with headers and excluded columns'
        );

        deepEqual(
            tf1.getHeadersText(false),
            [
                'From','Destination','Road Distance (km)', 'By Air (hrs)',
                'By Rail (hrs)'
            ],
            'Headers text'
        );

        deepEqual(
            tf1.getHeadersText(true),
            ['From', 'By Air (hrs)','By Rail (hrs)'],
            'Headers text with excluded columns'
        );

    });

    test('Destroy', function() {
        tf1.destroy();
        deepEqual(tf1.isInitialized(), false, 'Filters removed');
        tf1 = null;
    });
}
