$(function() {
  var query = $.queryParams();
  
  if (query == null || query['name'] == null || query['name'] == '') {
    $('body').append($('<p>').addClass('missing-query').text('Please provide a name...'));
  } else {
    var name = query['name'];
    if (name.indexOf('_') > -1) {
      name = name.replace(/[_]+/g, ' ');
    }

    $.ajax({
        url: 'data/gyms.json',
        cache : true,
        contentType : 'application/json',
        success : function(result, status, xhr) {
            var list = result.filter(function(item) {
              return item.name === name;
            });

            if (list.length === 1) {
              $('body').append(generateGymInfo(list[0]));
            } else {
              $('body').append($('<p>').addClass('missing-query').text('Gym not found...'));
            }
        },
        error : function(xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
  }
});
