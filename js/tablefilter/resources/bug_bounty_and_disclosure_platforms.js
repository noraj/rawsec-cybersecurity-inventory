var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'none',
    col_2: 'none',
    col_3: 'input',
    col_4: 'select',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'none',
        'none',
        'string',
        'string',
    ],
    enable_empty_option: true,
    enable_non_empty_option: true,
});
var tf = new TableFilter(document.querySelector('#resources-bug-bounty-and-disclosure-platforms'), filtersConfig);
tf.init();
