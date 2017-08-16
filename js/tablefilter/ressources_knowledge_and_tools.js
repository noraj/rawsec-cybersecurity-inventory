var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'none',
    col_2: 'input',
    col_3: 'select',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'none',
        'string',
        'string',
    ],
    enable_empty_option: true,
    enable_non_empty_option: true,
});
var tf = new TableFilter(document.querySelector('#resources-knowledge-and-tools'), filtersConfig);
tf.init();
