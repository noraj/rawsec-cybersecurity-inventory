var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'input',
    col_2: 'none',
    col_3: 'none',
    col_4: 'input',
    col_5: 'select',
    col_6: 'select',
    col_7: 'select',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'caseinsensitivestring',
        'none',
        'none',
        'string',
        'string',
        'string',
        'string',
    ],
    enable_empty_option: true,
    enable_non_empty_option: true,
});
var tf = new TableFilter(document.querySelector('#tools-plugins'), filtersConfig);
tf.init();
