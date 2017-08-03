var gymList = null;

$(function() {
    $.ajax({
        url: 'data/gyms.json',
        cache : true,
        contentType : 'application/json',
        success : function(result,status,xhr){
            gymList = result;
        },
        error : function(xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
    
    
    // Get the modal
    var $modal = $('#my-modal');
    // Get the button that opens the modal
    var $btn = $(".search-button");
    // Get the <span> element that closes the modal
    var $span = $(".close").first();

    // When the user clicks on the button, open the modal 
    $btn.on('click', function(e) {
      var content = generateContent($('.search .search-term').first().val());
      $modal.find('.modal-content').empty().append(content);
      $modal.show();
    });

    // When the user clicks on <span> (x), close the modal
    $span.on('click', function() {
      $modal.hide();
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == $modal[0]) {
        $modal.hide();
      }
    }
});

function generateContent(query) {
  var terms = query.toLowerCase().split(/\s+/g);
  var filteredGyms = gymList.filter(function(gym) {
    var content = [gym['name'], gym['area'], gym['notes']].join(' ').toLowerCase();
    return terms.some(function(term) {
      //return content.indexOf(term) > -1;
      return new RegExp('\\b' + term + '\\b', 'g').test(content);
    });
  });
  
  return $('<div>').addClass('result-list').append(filteredGyms.map(function(gym) {
    return $('<div>').addClass('result-list-item').text(gym.name);
  }));
}