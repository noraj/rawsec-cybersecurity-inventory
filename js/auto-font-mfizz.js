// Find all icon types in font-mfizz
var iconTypes = [];
sheets = document.styleSheets;
for(var i = 0; i < sheets.length; i++) {
    if(sheets[i].href !== null) {
        if(sheets[i].href.match(/font-mfizz\.css/)) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for(var j = 0; j < rules.length; j++) {
                var selectorText = rules[j].selectorText;
                if(selectorText && selectorText.match(/\.icon-([a-z]*)::before/)) {
                    var icon = selectorText.match(/\.icon-([a-z]*)::before/)[1];
                    iconTypes.push(icon);
                }
            }
        }
    }
}
// Add the font-mfizz css class to each element
$('table tr td').each(function(){
    var tdContent = $(this).html().toLowerCase();
    if ($.inArray(tdContent, iconTypes) > -1) {
        $(this).addClass('icon-' + tdContent);
    }
})
