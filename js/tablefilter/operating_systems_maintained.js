var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'select',
    col_2: 'checklist',
    col_3: 'none',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'string',
        'string',
        'none',
    ],
});
var tf = new TableFilter(document.querySelector('#operating-systems-maintained'), filtersConfig);
tf.init();
