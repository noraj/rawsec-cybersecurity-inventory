
var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    on_filters_loaded: filtersLoadedTests
});
tf.init();


function filtersLoadedTests(){
    tf.setFilterValue(0, 'Adelaide');
    tf.setFilterValue(1, 'Perth');
    tf.filter();

    // issue 241: can filter table in filters loaded callback
    module('TableFilter with filters loaded callback');
    test('Can filter table on callback', function() {
        deepEqual(tf.initialized, true, 'TableFilter is initialized');
        deepEqual(tf.getValidRowsNb(), 1, 'Nb of filtered rows');
    });

    module('Tear-down');
    test('Can destroy', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Destroyed');

        // After filter callback tests
        afterFilterTests();
    });
}

function afterFilterTests(){
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_1: 'checklist',
        on_after_filter: afterFilter
    });
    var ct = 0;
    tf.init();

    // setup
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('click', true, true);
    var flt1 = tf.getFilterElement(1);

    // act
    flt1.getElementsByTagName('li')[4].firstChild.dispatchEvent(evObj);

    // issue 246: on_after_filter callback triggered twice from checklist filter
    function afterFilter(){
        ct++;
        module('TableFilter with on_after_filter callback');
        test('after filter callback fired once', function() {
            // assert
            deepEqual(ct, 1, 'Nb of times is fired');
            deepEqual(tf.getFilterValue(1), ['Canberra'], 'Selected option');
        });
    }
};
