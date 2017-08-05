var $modal = null;

$(function() {
  var q = window.location.pathname.split(/\//g).pop();
  var name = replaceUnderscore(q);
  
  $.ajax({
      url: '../data/gyms.json',
      cache : true,
      contentType : 'application/json',
      success : function(result, status, xhr) {
          var list = result.filter(function(item) {
            return item.name === name;
          });

          if (list.length === 1) {
            $('body').append(generateGymInfo(list[0], result, 'photo-disc-photo-large'));
          } else {
             $('body').append($.errorMessage('Gym not found...'));
          }
      },
      error : function(xhr, status, error) {
          console.log('Error: ' + error);
      }
  });
  
  // Get the modal
  $modal = $('#my-modal');
  // Get the <span> element that closes the modal
  $('.modal .modal-window .close-btn').first().on('click', function(e) {
    $modal.hide();
  });

  $('.modal .modal-window .open-window-btn').first().on('click', function(e) {
    window.location.href = 'gym/' + selectedGym.name.replace(/\s+/g, '_');
  });

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == $modal[0]) {
      $modal.hide();
    }
  }
});
