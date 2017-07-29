
var id = function (id){ return document.getElementById(id); };

var tf = new TableFilter('demo', {
    base_path: '../dist/tablefilter/',
    col_2: 'multiple',
    col_3: 'select',
    col_4: 'none',
    popup_filters: true
});
tf.init();

var popupFilter = tf.feature('popupFilter');
module('Sanity checks');
test('Pop-up filter component', function() {
    notEqual(popupFilter, null, 'PopupFilter instanciated');
    deepEqual(popupFilter.fltElms instanceof Array,
        true, 'Type of fltElms property');
    deepEqual(
        popupFilter.adjustToContainer,
        true,
        'Popup filter width adjusts to container'
    );
    deepEqual(tf.headersRow, 1, 'Headers row index');
    // issue 99: getHeadersText for pick-list filter types
    deepEqual(
        tf.getHeadersText()[2],
        'Road Distance (km)',
        'Expected header text for multiple filter type'
    );
    deepEqual(
        tf.getHeadersText()[3],
        'By Air (hrs)',
        'Expected header text for multiple filter type'
    );
});

module('UI elements');
test('Pop-up filter UI elements', function() {
    var flt1 = id(tf.fltIds[3]);
    var flt2 = id(tf.fltIds[2]);
    var fltIcn1 = popupFilter.fltIcons[3];
    var fltIcn2 = popupFilter.fltIcons[2];
    var fltIcn3 = popupFilter.fltIcons[4];

    notEqual(flt1, null, 'Filter element exists');
    notEqual(flt2, null, 'Filter element exists');
    deepEqual(flt2.hasAttribute('multiple'), true, 'Multiple select exists');
    deepEqual(fltIcn1.nodeName, 'IMG', 'Filter icon exists');
    deepEqual(fltIcn2.nodeName, 'IMG', 'Filter icon exists');
    deepEqual(fltIcn3, undefined, 'Filter icon does not exist for column 4');
});

test('Pop-up filter state after filtering', function(){
    var fltIcn0 = popupFilter.fltIcons[0];
    tf.setFilterValue(0, 'syd');
    tf.filter();

    deepEqual(fltIcn0.src.indexOf('icn_filterActive') !== -1,
        true, 'Icon state');
});

test('Pop-up filter state after clearing', function(){
    var fltIcn0 = popupFilter.fltIcons[0];
    var fltIcn1 = popupFilter.fltIcons[1];
    var fltIcn2 = popupFilter.fltIcons[2];
    var fltIcn3 = popupFilter.fltIcons[3];
    tf.clearFilters();

    deepEqual(fltIcn0.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn1.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn2.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn3.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
});

test('Can open pop-up filter', function(){
    // act
    popupFilter.open(1);

    // assert
    deepEqual(popupFilter.fltElms[1].style.display, 'block',
        'Popup filter is open');
});

test('Can close pop-up filter', function(){
    // act
    popupFilter.close(1);

    // assert
    deepEqual(popupFilter.fltElms[1].style.display, 'none',
        'Popup filter is open');
});

test('Can toggle pop-up filter (initially closed)', function(){
    // setup
    popupFilter.close(2);

    // act
    popupFilter.toggle(2);

    // assert
    deepEqual(popupFilter.fltElms[2].style.display, 'block',
        'Popup filter is toggled');
});

test('Can toggle pop-up filter (initially opened)', function(){
    // setup
    popupFilter.open(2);

    // act
    popupFilter.toggle(2);

    // assert
    deepEqual(popupFilter.fltElms[2].style.display, 'none',
        'Popup filter is toggled');
});

test('Multiple selection pop-up filter remains open upon filtering', function(){
    // setup
    popupFilter.open(2);

    // act
    tf.setFilterValue(2, ['1412', '982']);
    tf.filter();

    // assert
    deepEqual(
        popupFilter.isOpen(2),
        true,
        'Multiple selection pop-up filter still open after filtering'
    );
});

test('Pop-up filter closes upon filtering', function(){
    // setup
    popupFilter.open(1);

    // act
    tf.setFilterValue(1, 'Adelaide');
    tf.filter();

    // assert
    deepEqual(popupFilter.isOpen(1), false,
        'Pop-up filter closed after filtering'
    );
});

test('Pop-up filter auto-closes when user clicks away', function() {
    // setup
    popupFilter.open(0);

    // act
    var evObj = document.createEvent('HTMLEvents');
    evObj.initEvent('mouseup', true, true);
    tf.tbl.rows[4].cells[2].dispatchEvent(evObj);

    // assert
    deepEqual(popupFilter.isOpen(0), false,
        'Pop-up filter closed after user clicks away'
    );
});

test('Can destroy and reset', function(){
    // setup
    popupFilter.destroy();

    // act
    popupFilter.reset();

    // assert
    deepEqual(popupFilter.fltElms.length, 5, 'Filters are generated');
    deepEqual(popupFilter.fltIcons.length, 4, 'Icons are generated');
    deepEqual(popupFilter.fltSpans.length, 4, 'Icon containers are generated');
});

test('TableFilter removed', function() {
    tf.destroy();
    var fltIcn1 = popupFilter.fltIcons[3];
    deepEqual(fltIcn1, undefined, 'Filter icon is removed');
    deepEqual(id(tf.fltIds[3]), null, 'Filter is removed');
});

test('TableFilter re-initialised', function() {
    tf.init();
    var fltIcn1 = popupFilter.fltIcons[3];
    deepEqual(fltIcn1.nodeName, 'IMG', 'Filter icon exists');
    deepEqual(id(tf.fltIds[3]).nodeName, 'SELECT', 'Filter exists');
});

module('Grid-layout');
test('Re-instantiated with grid-layout', function() {
    tf.destroy();
    tf = null;
    tf = new TableFilter('demo', {
        base_path: '../dist/tablefilter/',
        col_2: 'multiple',
        col_3: 'select',
        col_4: 'none',
        popup_filters: true,
        grid_layout: true
    });
    tf.init();

    notEqual(popupFilter, null, 'PopupFilter instanciated');
    deepEqual(popupFilter.fltElms instanceof Array,
        true, 'Type of fltElms property');
    deepEqual(tf.headersRow, 0, 'Headers row index');
    // issue 99: getHeadersText for pick-list filter types
    deepEqual(
        tf.getHeadersText()[2],
        'Road Distance (km)',
        'Expected header text for multiple filter type'
    );
    deepEqual(
        tf.getHeadersText()[3],
        'By Air (hrs)',
        'Expected header text for multiple filter type'
    );
});

test('Pop-up filter UI elements with grid-layout', function() {
    var popupFilter = tf.feature('popupFilter');
    var flt1 = id(tf.fltIds[3]);
    var flt2 = id(tf.fltIds[2]);
    var fltIcn1 = popupFilter.fltIcons[3];
    var fltIcn2 = popupFilter.fltIcons[2];
    var fltIcn3 = popupFilter.fltIcons[4];

    notEqual(flt1, null, 'Filter element exists');
    notEqual(flt2, null, 'Filter element exists');
    deepEqual(flt2.hasAttribute('multiple'), true, 'Multiple select exists');
    deepEqual(fltIcn1.nodeName, 'IMG', 'Filter icon exists');
    deepEqual(fltIcn2.nodeName, 'IMG', 'Filter icon exists');
    deepEqual(fltIcn3, undefined, 'Filter icon does not exist for column 4');
});

test('Pop-up filter state after filtering', function(){
    var popupFilter = tf.feature('popupFilter');
    var fltIcn0 = popupFilter.fltIcons[0];
    tf.setFilterValue(0, 'syd');
    tf.filter();

    deepEqual(fltIcn0.src.indexOf('icn_filterActive') !== -1,
        true, 'Icon state');
});

test('Pop-up filter state after clearing', function(){
    var popupFilter = tf.feature('popupFilter');
    var fltIcn0 = popupFilter.fltIcons[0];
    var fltIcn1 = popupFilter.fltIcons[1];
    var fltIcn2 = popupFilter.fltIcons[2];
    var fltIcn3 = popupFilter.fltIcons[3];
    tf.clearFilters();

    deepEqual(fltIcn0.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn1.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn2.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
    deepEqual(fltIcn3.src.indexOf('icn_filterActive') === -1,
        true, 'Icon state');
});

module('Feature interface');
test('Properties', function() {
    var popupFilter = tf.feature('popupFilter');

    deepEqual(popupFilter.tf instanceof TableFilter,
        true, 'TableFilter instance');
    deepEqual(popupFilter.feature, 'popupFilters', 'Feature name');
    deepEqual(popupFilter.enabled, true, 'Feature enabled');
    deepEqual(popupFilter.initialized, true, 'Feature enabled');
    deepEqual(typeof popupFilter.emitter, 'object',
        'Feature has emitter instance');
    deepEqual(typeof popupFilter.config, 'object', 'TF configuration object');
    deepEqual(typeof popupFilter.init, 'function', 'Feature init method');
    deepEqual(typeof popupFilter.destroy, 'function', 'Feature destroy method');
    deepEqual(typeof popupFilter.reset, 'function', 'Feature reset method');
    deepEqual(typeof popupFilter.enable, 'function', 'Feature enable method');
    deepEqual(typeof popupFilter.disable, 'function', 'Feature enable method');
    deepEqual(typeof popupFilter.isEnabled,
        'function', 'Feature enable method');
});

module('Tear-down');
test('TableFilter removed', function() {
    tf.destroy();
    var fltIcn1 = popupFilter.fltIcons[3];
    deepEqual(fltIcn1, undefined, 'Filter icon is removed');
    deepEqual(id(tf.fltIds[3]), null, 'Filter is removed');
    deepEqual(tf.isInitialized(), false, 'Filters removed');
});
