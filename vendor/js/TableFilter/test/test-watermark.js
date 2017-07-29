(function(win, TableFilter){

    var tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        watermark: 'foobar'
    });
    tf.init();

    module('Sanity checks');
    test('Watermark properties', function() {
        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
        deepEqual(tf.watermark, 'foobar', 'Property value');
        deepEqual(tf.isWatermarkArray, false,
            'Type: same watermark for all filters');
    });

    test('DOM element', function(){
        var flt0 = tf.getFilterElement(0);
        var flt1 = tf.getFilterElement(3);
        deepEqual(flt0.placeholder, 'foobar', 'filter`s placeholder value');
        deepEqual(flt1.placeholder, 'foobar', 'filter`s placeholder value');
    });

    module('Per column watermark');
    test('Sanity checks', function() {
        tf.destroy();
        tf = new TableFilter('demo', {
            base_path: '../dist/tablefilter/',
            watermark: ['City', 'City', 'Distance', 'Time', 'Time']
        });
        tf.init();

        deepEqual(tf instanceof TableFilter, true, 'TableFilter instanciated');
        deepEqual(tf.isWatermarkArray, true, 'Type: watermark array');
        deepEqual(
            tf.watermark,
            ['City', 'City', 'Distance', 'Time', 'Time'],
            'Property value'
        );
    });

    test('DOM element', function(){
        deepEqual(
            tf.getFilterElement(0).placeholder,
            'City',
            'filter`s placeholder value'
        );
        deepEqual(
            tf.getFilterElement(1).placeholder,
            'City',
            'filter`s placeholder value'
        );
        deepEqual(
            tf.getFilterElement(2).placeholder,
            'Distance',
            'filter`s placeholder value'
        );
        deepEqual(
            tf.getFilterElement(3).placeholder,
            'Time',
            'filter`s placeholder value'
        );
        deepEqual(
            tf.getFilterElement(4).placeholder,
            'Time',
            'filter`s placeholder value'
        );
    });

    module('Tear-down');
    test('TableFilter removed', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Filters removed');
        deepEqual(
            tf.watermark,
            ['City', 'City', 'Distance', 'Time', 'Time'],
            'Property value'
        );
    });

})(window, TableFilter);
