(function($) {
  $.queryParams = function() {
    var qs = window.location.search.replace('?', '').split('&'),
        request = {};
    $.each(qs, function(i, v) {
      var initial,
          pair = v.split('='),
          key = pair[0],
          value = decodeURIComponent(pair[1]);
      if (initial = request[key]){
        if (!$.isArray(initial)) {
          request[key] = [initial]
        }
        request[key].push(value);
      } else {
        request[key] = value;
      }
      return;
    });
    
    return request;
  }
})(jQuery);