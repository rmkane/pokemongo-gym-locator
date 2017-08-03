$(function() {
  $('.search .search-term').on('keypress', function(e) {
    if (e.keyCode == 13) {
        $('.search-button').trigger('click');
    }
  });

  $('.search-button').on('click', function(e) {
    window.location.href = 'search.html?' + $.param({
      q : $('.search .search-term').val().trim()
    });
  });
});