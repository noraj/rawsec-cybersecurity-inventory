var baseConfig = {
    base_path: 'js/vendor/tablefilter/',
    alternate_rows: true,
    highlight_keywords: false,
    ignore_diacritics: true,
    no_results_message: true,
    // Let the CSS do that
    responsive: false,
    // Auto filter, filter as you type
    auto_filter: true,
    auto_filter_delay: 500, //milliseconds
    // Put header above filter
    //filters_row_index: 1,
    rows_counter: true,
    btn_reset: true,
    status_bar: true,
    msg_filter: 'Filtering...',
    popup_filters: true,
    // Sortable columns
    extensions: [{
        name: 'sort',
        sort_col_at_start: [0, false]
    }],
    // Show clear buton
    enable_slc_reset_filter: true,
    help_instructions: true,
};
