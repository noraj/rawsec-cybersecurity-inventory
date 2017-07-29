
module('Sanity checks');
test('No Results Feature', function() {
    var tf = new TableFilter('demo0', {
        base_path: '../dist/tablefilter/',
        no_results_message: true
    });
    tf.init();
    var noResults = tf.feature('noResults');

    deepEqual(tf instanceof TableFilter, true, 'TableFilter instantiated');
    notEqual(noResults, null, 'noResults instantiated');
    deepEqual(tf.noResults, true, 'noResults property');

    module('Feature interface');
    test('Properties', function() {
        deepEqual(noResults.tf instanceof TableFilter, true,
            'TableFilter instance');
        deepEqual(noResults.feature, 'noResults', 'Feature name');
        deepEqual(noResults.enabled, true, 'Feature enabled');
        deepEqual(noResults.initialized, true, 'Feature initialized');
        deepEqual(typeof noResults.emitter, 'object',
            'Feature has emitter instance');
        deepEqual(typeof noResults.config, 'object', 'TF configuration object');
        deepEqual(typeof noResults.init, 'function', 'Feature init method');
        deepEqual(typeof noResults.destroy, 'function',
            'Feature destroy method');
        deepEqual(typeof noResults.reset, 'function', 'Feature reset method');
        deepEqual(typeof noResults.enable, 'function', 'Feature enable method');
        deepEqual(typeof noResults.disable, 'function',
            'Feature enable method');
        deepEqual(typeof noResults.isEnabled, 'function',
            'Feature enable method');
    });
    test('Can destroy', function() {
        noResults.destroy();
        deepEqual(noResults.initialized, false, 'not initialised');
    });
    test('Can reset', function() {
        noResults.reset();
        deepEqual(noResults.enabled, true, 'enabled');
    });
    test('Can disable', function() {
        noResults.disable();
        deepEqual(noResults.enabled, false, 'disabled');
    });
    test('Can enable', function() {
        noResults.enable();
        deepEqual(noResults.enabled, true, 'enabled');
    });
    test('Can init', function() {
        noResults.destroy();
        noResults.enable();
        noResults.init();
        deepEqual(noResults.enabled, true, 'enabled');
    });
    test('Can check is enabled', function() {
        noResults.isEnabled();
        deepEqual(noResults.enabled, true, 'enabled');
    });

    module('Behaviour');
    test('Can display no results message', function() {
        tf.setFilterValue(0, 'sadasd');
        tf.filter();
        deepEqual(tf.getValidRows().length, 0, 'Filtered rows number');
        deepEqual(noResults.cont.innerHTML, 'No results', 'No results message');
        deepEqual(noResults.cont.style.display, 'block',
            'No results message displayed');
    });

    test('Can hide no results message', function() {
        tf.clearFilters();
        deepEqual(tf.getValidRows().length, 7, 'Filtered rows number');
        deepEqual(noResults.cont.innerHTML, 'No results', 'No results message');
        deepEqual(noResults.cont.style.display, 'none', 'Message hidden');
    });

    test('can destroy TableFilter DOM elements', function() {
        tf.destroy();
        deepEqual(tf.isInitialized(), false, 'Filters removed');
        tf = null;
    });
});

module('Customisation');
test('External container sanity checks', function() {
    var tfCustom = new TableFilter('demo1', {
        base_path: '../dist/tablefilter/',
        no_results_message: {
            custom_container: document.querySelector('#ext-cont'),
            content: '<h3>No results found</h3>',
            css_class: 'test'
        }
    });
    tfCustom.init();
    var noResultsCustom = tfCustom.feature('noResults');

    deepEqual(tfCustom instanceof TableFilter, true,
        'TableFilter instanciated');
    notEqual(noResultsCustom, null, 'noResults instantiated');
    deepEqual(tfCustom.noResults, true, 'noResults property');
    deepEqual(noResultsCustom.cont.nodeName, 'DIV',
        'external container element');
    deepEqual(noResultsCustom.cont.className, 'test',
        'external container element CSS class');

    test('Can display external no results message', function() {
        tfCustom.setFilterValue(0, 'sadasd');
        tfCustom.filter();
        deepEqual(noResultsCustom.cont.innerHTML, '<h3>No results found</h3>',
            'No results message markup');
        deepEqual(noResultsCustom.cont.style.display, 'block',
            'No results message displayed');
    });

    test('Can hide external no results message', function() {
        tfCustom.clearFilters();
        deepEqual(tfCustom.getValidRows().length, 7, 'Filtered rows number');
        deepEqual(noResultsCustom.cont.style.display, 'none', 'Message hidden');
    });

    test('can destroy TableFilter DOM elements', function() {
        tfCustom.destroy();
        deepEqual(tfCustom.isInitialized(), false, 'Filters removed');
        tfCustom = null;
    });
});

module('Integration with grid layout');
test('Sanity checks', function() {
    var tfGl = new TableFilter('demo2', {
        base_path: '../dist/tablefilter/',
        grid_layout: true,
        no_results_message: true
    });
    tfGl.init();
    var noResultsGl = tfGl.feature('noResults');
    var gridLayout = tfGl.feature('gridLayout');

    deepEqual(tfGl instanceof TableFilter, true, 'TableFilter instanciated');
    notEqual(noResultsGl, null, 'noResults instantiated');
    deepEqual(tfGl.noResults, true, 'noResults property');
    deepEqual(noResultsGl.cont.nodeName, 'DIV', 'Container element');
    deepEqual(noResultsGl.cont.className, 'no-results',
       'Container element default CSS class');

    test('Can display no results message in grid layout', function() {
        tfGl.setFilterValue(0, 'sadasd');
        tfGl.filter();
        deepEqual(noResultsGl.cont.innerHTML, 'No results',
            'No results message');
        deepEqual(noResultsGl.cont.style.display, 'block',
            'No results message displayed');
        deepEqual(
            parseInt(noResultsGl.cont.style.width, 10),
            gridLayout.tblCont.clientWidth,
            'Container element width'
        );
    });

    test('Can hide no results message', function() {
        tfGl.clearFilters();
        deepEqual(noResultsGl.cont.style.display, 'none', 'Message hidden');
    });

    test('can destroy TableFilter DOM elements', function() {
        tfGl.destroy();
        deepEqual(tfGl.isInitialized(), false, 'Filters removed');
        tfGl = null;
    });
});

module('Callbacks');
test('External container sanity checks', function() {
    var tfCall = new TableFilter('demo3', {
        base_path: '../dist/tablefilter/',
        no_results_message: {
            on_before_show_msg: function(tfCall, noResultsCall) {
                callback(tfCall, noResultsCall, 'onBeforeShowMessage');
            },
            on_after_show_msg: function(tfCall, noResultsCall) {
                callback(tfCall, noResultsCall, 'onAfterShowMessage');
            },
            on_before_hide_msg: function(tfCall, noResultsCall) {
                callback(tfCall, noResultsCall, 'onBeforeHideMessage');
            },
            on_after_hide_msg: function(tfCall, noResultsCall) {
                callback(tfCall, noResultsCall, 'onAfterHideMessage');
            }
        }
    });
    tfCall.init();
    var noResultsCall = tfCall.feature('noResults');

    deepEqual(tfCall instanceof TableFilter, true, 'TableFilter instanciated');
    notEqual(noResultsCall, null, 'noResults instantiated');
    deepEqual(tfCall.noResults, true, 'noResults property');
    deepEqual(noResultsCall.cont.nodeName, 'DIV', 'container element');

    tfCall.setFilterValue(0, 'sadasd');
    tfCall.filter();

    tfCall.setFilterValue(0, 'Sydney');
    tfCall.filter();

    function callback(tfCall, noResultsCall, type) {
        module('Callbacks');
        test(type, function() {
            deepEqual(tfCall instanceof TableFilter, true,
                'First argument type');
            deepEqual(typeof noResultsCall.onBeforeShow, 'function',
                'Second argument type');
        });
    }

    test('can destroy TableFilter DOM elements', function() {
        tfCall.destroy();
        deepEqual(tfCall.isInitialized(), false, 'Filters removed');
        tfCall = null;
    });
});
