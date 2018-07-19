var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'select',
    col_2: 'none',
    col_3: 'input',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'string',
        'none',
        'string',
    ],
    enable_empty_option: true,
    enable_non_empty_option: true,
});
var tf = new TableFilter(document.querySelector('#resources-national-security-agencies-and-services'), filtersConfig);
tf.init();
