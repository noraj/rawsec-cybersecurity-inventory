

module('TableFilter with no rows');
test('throws when no rows', function() {
    throws(
        function() { new TableFilter('demo') },
        Error,
        'Throws Error when DOM table does not contain rows'
    );
});
