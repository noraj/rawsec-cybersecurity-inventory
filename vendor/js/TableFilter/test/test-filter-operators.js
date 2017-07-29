(function(win, TableFilter){

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/'
    });
    tf.init();

    module('Sanity checks');
    test('Filters', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
        notEqual(tf.getFilterElement(0), null, 'Filter generated');
    });

    module('Operators');
    test('Regex operator - rgx:', function() {
        tf.setFilterValue(3, 'rgx:[4-5]');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
        deepEqual(
            filteredData[1],
            [3, ['Sydney', 'Brisbane', '982', '1.5', '16']],
            'Expected row data'
        );
    });

    test('Empty operator - [empty]', function() {
        tf.clearFilters();
        tf.setFilterValue(4, '[empty]');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [6, ['Adelaide', 'Perth', '2781', '3.1', '']],
            'Expected row data'
        );
    });

    test('Non-empty operator - [nonempty]', function() {
        tf.clearFilters();
        tf.setFilterValue(4, '[nonempty]');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 6, 'Expected number of matches');
        deepEqual(
            filteredData[5],
            [8, ['Adelaide', 'Brisbane', '2045', '2.15', '40']],
            'Expected row data');
    });

    test('Or operator - ||', function() {
        tf.clearFilters();
        tf.setFilterValue(1, 'Canberra||Alice Springs');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 2, 'Expected number of matches');
        deepEqual(
            filteredData[1],
            [7, ['Adelaide', 'Alice Springs', '1533', '2', '20.25']],
            'Expected row data'
        );
    });

    test('And operator - &&', function() {
        tf.clearFilters();
        tf.setFilterValue(1, 'Al&&Spr');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [7, ['Adelaide', 'Alice Springs', '1533', '2', '20.25']],
            'Expected row data'
        );
    });

    test('Greater than operator - >', function() {
        tf.clearFilters();
        tf.setFilterValue(2, '>1600');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 2, 'Expected number of matches');
        deepEqual(
            filteredData[1],
            [8, ['Adelaide', 'Brisbane', '2045', '2.15', '40']],
            'Expected row data'
        );
    });

    test('Lower than operator - <', function() {
        tf.clearFilters();
        tf.setFilterValue(3, '<1.5');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
        deepEqual(
            filteredData[2],
            [5, ['Sydney', 'Melbourne', '872', '1.1', '10.5']],
            'Expected row data'
        );
    });

    test('Greater than or equal to operator - >=', function() {
        tf.clearFilters();
        tf.setFilterValue(2, '>=2781');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [6, ['Adelaide', 'Perth', '2781', '3.1', '']],
            'Expected row data'
        );
    });

    test('Lower than or equal to operator - <=', function() {
        tf.clearFilters();
        tf.setFilterValue(3, '<=0.6');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [4, ['Sydney', 'Canberra', '286', '.6', '4.3']],
            'Expected row data'
        );
    });

    test('Different from operator - !', function() {
        tf.clearFilters();
        tf.setFilterValue(0, '!Sydney');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 3, 'Expected number of matches');
        deepEqual(
            filteredData[2],
            [8, ['Adelaide', 'Brisbane', '2045', '2.15', '40']],
            'Expected row data'
        );
    });

    test('Like operator - *', function() {
        tf.clearFilters();
        tf.setFilterValue(1, '*our');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [5, ['Sydney', 'Melbourne', '872', '1.1', '10.5']],
            'Expected row data'
        );
    });

    test('Equal operator - =', function() {
        tf.clearFilters();
        tf.setFilterValue(1, '=Pe');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'Expected number of matches');

        tf.clearFilters();
        tf.setFilterValue(1, '=Perth');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 1, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [6, ['Adelaide', 'Perth', '2781', '3.1', '']],
            'Expected row data'
        );
    });

    test('Starts with - {', function() {
        tf.clearFilters();
        tf.setFilterValue(1, '{a');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 2, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [2, ['Sydney', 'Adelaide', '1412', '1.4', '25.3']],
            'Expected row data'
        );
    });

    test('Ends with - }', function() {
        tf.clearFilters();
        tf.setFilterValue(1, '}e');
        tf.filter();
        var filteredData = tf.getFilteredData();
        deepEqual(tf.getValidRows().length, 4, 'Expected number of matches');
        deepEqual(
            filteredData[0],
            [2, ['Sydney', 'Adelaide', '1412', '1.4', '25.3']],
            'Expected row data'
        );
    });

    module('Tear-down');
    test('can destroy TableFilter DOM elements', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Filters removed');
    });

})(window, TableFilter);
