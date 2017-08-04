$(function() {
  $('.search .search-term').on('keypress', function(e) {
    if (e.keyCode == 13) {
        $('.search-button').trigger('click');
    }
  });

  $('.search-button').on('click', function(e) {
    var query = getQuery();
    if (query.length > 0) {
      window.location.href = 'search.html?' + $.param({
        q : replaceSpaces(getQuery())
      });
    }
  });
});

function getQuery() {
  return $('.search .search-term').val().trim();
}
