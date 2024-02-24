var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'input',
    col_2: 'select',
    col_3: 'input',
    col_4: 'none',
    col_5: 'none',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'caseinsensitivestring',
        'string',
        'string',
        'none',
        'none',
    ],
    enable_empty_option: true,
    enable_non_empty_option: true,
});
var tf = new TableFilter(document.querySelector('#certifications-governance'), filtersConfig);
tf.init();
