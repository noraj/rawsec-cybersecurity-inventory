var filtersConfig = Object.assign({}, baseConfig);
jQuery.extend(filtersConfig, {
    // Filter types
    col_0: 'input',
    col_1: 'input',
    // columns data types
    col_types: [
        'caseinsensitivestring',
        'string',
    ],
});
var tf = new TableFilter(document.querySelector('#operating-systems-project-transferred'), filtersConfig);
tf.init();
