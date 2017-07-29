(function(win, TableFilter){
    var id = function (id){ return document.getElementById(id); };

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_0: 'select',
        col_1: 'multiple',
        on_change: false
    });
    tf.init();

    module('Sanity checks');
    test('Disable onchange event on select filter', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.onSlcChange, false, 'Onchange event disabled');
    });

    module('Behaviour');
    test('Cannot filter on selection change', function() {
        var flt0 = id(tf.fltIds[0]);
        var flt1 = id(tf.fltIds[1]);
        var evObj = document.createEvent('HTMLEvents');
        evObj.initEvent('change', true, true);

        tf.setFilterValue(0, 'Sydney');
        flt0.dispatchEvent(evObj);
        tf.setFilterValue(1, 'Canberra');
        flt1.dispatchEvent(evObj);

        deepEqual(tf.getValidRows().length, 0, 'Table not filtered');
        deepEqual(tf.nbHiddenRows, 0, 'No hidden rows');
    });

    module('Tear-down');
    test('TableFilter removed', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Filters removed');
    });

})(window, TableFilter);
