(function(win, TableFilter){
    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        enter_key: false
    });
    tf.init();

    module('Sanity checks');
    test('Disable enter key on textbox filters', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter type');
        deepEqual(tf.enterKey, false, '<Enter> key disabled');
    });

})(window, TableFilter);
