var $modal = null;
var gymList = null;
var selectedGym = null;

$(function() {
  var query = $.queryParams();
  
  if (query == null || query['q'] == null || query['q'] == '') {
    $('body').append(
      $('<p>').addClass('missing-query').text('Please enter a search query...'));
  } else {
    var q = replaceUnderscore(query['q']);

    $.ajax({
        url: 'data/gyms.json',
        cache : true,
        contentType : 'application/json',
        success : function(result, status, xhr) {
            gymList = result.sort(function(g1, g2) {
              return g1.name.localeCompare(g2.name);
            });
            $('body').append(generateResultList(q));
            
            if ($('.result-list').children().length === 0) {
              $('.result-list').replaceWith($.errorMessage('Could not find any gyms matching: ' + q));
            }
        },
        error : function(xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
  }
  
  // Get the modal
  $modal = $('#my-modal');
  // Get the <span> element that closes the modal
  $('.modal .modal-window .close-btn').first().on('click', function(e) {
    $modal.hide();
  });

  $('.modal .modal-window .open-window-btn').first().on('click', function(e) {
    window.location.href = 'gym.html?' + $.param({
      name : replaceSpaces(selectedGym.name)
    });
  });
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == $modal[0]) {
      $modal.hide();
    }
  }

  $(document).on('click', '.result-list .result-list-item', onResultClick);
});

function onResultClick(e) {  
    var $item = $(e.target);
    var index = parseInt($item.attr('data-gym-index'), 10);
    selectedGym = findGymByIndex(index);
    $modal.find('.modal-content').empty().append(generateGymInfo(selectedGym));
    $modal.show();
}

function findGymByIndex(index) {
  return gymList.filter(function(gym) {
    return gym.index === index;
  })[0];
}

function generateResultList(query) {
  // https://stackoverflow.com/a/4032642
  var terms = query.toLowerCase().match(/\w+|"(?:\\"|[^"])+"/g).map(function(term) {
    if (term.indexOf('"') === 0) {
      return term.substring(1, term.length - 1);
    }
    return term;
  });
  
  var filteredGyms = null;
  
  if (terms.length === 1 && terms[0] === 'all') {
    return createListItems(gymList);
  } else {
    return createListItems(gymList.filter(function(gym) {
      var content = aggregateValues(gym, ['name', 'area', 'notes']);
      return terms.some(function(term) {
        return new RegExp('\\b' + term + '\\b', 'g').test(content);
      });
    }));
  }
}

function createListItems(gyms) {
  return $('<div>').addClass('result-list').append(gyms.map(function(gym) {
    return $('<div>').addClass('result-list-item').text(gym.name).attr('data-gym-index', gym.index).css('cursor','pointer');;
  }));
}
