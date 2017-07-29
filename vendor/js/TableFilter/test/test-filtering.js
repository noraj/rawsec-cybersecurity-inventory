var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_types: [
        null,
        { type: 'date', format: ['{dd}.{MM}.{yyyy|yy}'] },
        { type: 'date', format: ['{dd}.{months}.{yyyy}'] },
        null,
        null,
        'formatted-number'
    ]
});
tf.init();

module('Sanity checks');
test('TableFilter object', function() {
    deepEqual(tf instanceof TableFilter, true, 'TableFilter instantiated');
    deepEqual(tf.id, 'demo', 'id check');
    deepEqual(tf.filtersRowIndex, 0, 'Filters row index');
});

module('Issue 74');
test('can filter values in this format: 21.1.18 as string', function(){
    tf.setFilterValue(0, '2');
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
});
test('can filter values in this format: 21.1.18 as date', function(){
    tf.clearFilters();
    tf.setFilterValue(1, '21.1.2005');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
});
test('can filter values in this format: 21.1.18 as date with operator',
    function(){
        tf.clearFilters();
        tf.setFilterValue(1, '>21.1.04');
        tf.filter();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
    }
);

module('Issue 72');
test('can filter values in this format: 21-Jul-2010 as date', function(){
    tf.clearFilters();
    tf.setFilterValue(2, '14-Mar-2009');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
});
test('can filter values in this format: 21-Jul-2010 as date with operator',
    function(){
        tf.clearFilters();
        tf.setFilterValue(2, '<21-Jul-2010');
        tf.filter();
        deepEqual(tf.getValidRows().length, 2, 'Expected number of matches');
    }
);

module('Issue 217');
test('can filter columns with blank space separated values (1)', function(){
    tf.clearFilters();
    tf.setFilterValue(3, 'c');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
});
test('can filter columns with blank space separated values (2)', function(){
    tf.clearFilters();
    tf.setFilterValue(3, 'xyz');
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
});
test('can filter columns with alpha numeric values (1)', function(){
    tf.clearFilters();
    tf.setFilterValue(4, '1');
    tf.filter();
    deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
});
test('can filter columns with alpha numeric values (2)', function(){
    tf.clearFilters();
    tf.setFilterValue(4, 'numeric');
    tf.filter();
    deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
});
test('can filter numeric value (6)', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(5, 2767);
    tf.filter();

    // assert
    deepEqual(tf.getFilteredDataCol(5), ['2767'], 'Expected match');
});
test('Should return no results for an unmatched term (6)', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(5, 'hello world');
    tf.filter();

    // assert
    deepEqual(tf.getValidRows().length, 0, 'No matches');
});


module('Filtering data types');
module('Date types');
test('can filter date with `<` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '< 14-Mar-2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['23-Oct-2007'],
        'Expected match'
    );
});

test('can filter date with `<=` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '<= 14-Mar-2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['23-Oct-2007', '14-Mar-2009'],
        'Expected match'
    );
});

test('can filter date with `>` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '> 14/03/2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['3-Jan-2014'],
        'Expected match'
    );
});

test('can filter date with `>` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '>= 14/03/2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['3-Jan-2014', '14-Mar-2009'],
        'Expected match'
    );
});

test('can filter date with `!` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '! 14-Mar-2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['3-Jan-2014', '23-Oct-2007'],
        'Expected match'
    );
});

test('can filter date with `=` operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '= 14-Mar-2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['14-Mar-2009'],
        'Expected match'
    );
});

test('can filter date with `=` operator and different date format', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '= 14.03.2009');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['14-Mar-2009'],
        'Expected match'
    );
});

test('can filter date with different date format', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '2007-10-23');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['23-Oct-2007'],
        'Expected match'
    );
});

test('can filter empty value with [empty] operator', function(){
    // setup
    var cellValue = tf.getCellValue(tf.tbl.rows[2].cells[2]);
    tf.clearFilters();
    tf.tbl.rows[2].cells[2].innerHTML = '';

    // act
    tf.setFilterValue(2, '[empty]');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        [''],
        'Expected match'
    );

    tf.tbl.rows[2].cells[2].innerHTML = cellValue;
});

test('can filter empty value with [nonempty] operator', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '[nonempty]');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['3-Jan-2014', '23-Oct-2007', '14-Mar-2009'],
        'Expected match'
    );
});

test('can filter date with date range with operators', function(){
    // setup
    tf.clearFilters();

    // act
    tf.setFilterValue(2, '<3-jan-2014 && >=23-Oct-2007');
    tf.filter();

    // assert
    deepEqual(
        tf.getFilteredDataCol(2),
        ['23-Oct-2007', '14-Mar-2009'],
        'Expected match'
    );
});

module('Tear-down');
test('can destroy TableFilter DOM elements', function() {
    tf.destroy();
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
