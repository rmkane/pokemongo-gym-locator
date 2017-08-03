var $modal = null;
var gymList = null;

$(function() {
  var query = $.queryParams();
  
  if (query == null || query['q'] == undefined || query['q'] == '') {
    $('body').append($('<p>').text('Please enter a search query...'));
  } else {
    $.ajax({
        url: 'data/gyms.json',
        cache : true,
        contentType : 'application/json',
        success : function(result,status,xhr){
            gymList = result;
            $('body').append(generateResultList(query['q']));
        },
        error : function(xhr, status, error) {
            console.log('Error: ' + error);
        }
    });
  }
  
  // Get the modal
  $modal = $('#my-modal');
  // Get the <span> element that closes the modal
  $('.modal .modal-window .close').first().on('click', function() {
    $modal.hide();
  });
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == $modal[0]) {
      $modal.hide();
    }
  }
});

function generateResultList(query) {
  // https://stackoverflow.com/a/4032642
  var terms = query.toLowerCase().match(/\w+|"(?:\\"|[^"])+"/g).map(function(term) {
    if (term.indexOf('"') === 0) {
      return term.substring(1, term.length - 1);
    }
    return term;
  });
  
  var filteredGyms = gymList.filter(function(gym) {
    var content = [gym['name'], gym['area'], gym['notes']].join(' ').toLowerCase();
    return terms.some(function(term) {
      return new RegExp('\\b' + term + '\\b', 'g').test(content);
    });
  });
  
  return $('<div>').addClass('result-list').append(filteredGyms.map(function(gym) {
    return $('<div>').addClass('result-list-item').text(gym.name).attr('data-gym-index', gym.index);
  }));
}

function generateGymInfo(gym) {
  return $('<div>').addClass('gym-info')
    .append($('<h1>').text(gym.name))
    .append($('<p>').html(gym.street + '<br>' + gym.city + ', ' + gym.state + ' ' + gym.zip))
    .append($('<p>').html(convertDMS(gym.latitude, gym.longitude)))
    .append($('<p>')
      .append(createLink('https://gymhuntr.com/#', function(data) {
        return data.latitude + ',' + data.longitude;
      }, gym, 'Gymhuntr'))
      .append(createLink('http://maps.google.com/?layer=t&saddr=Current+Location&daddr=', function(data) {
        return [ data.street, data.city, data.state, data.zip ].join(' ');
      }, gym, 'Directions')));
}

function createLink(url, fn, data, text) {
  var href = url + fn(data);
  return $('<a>').addClass('external-link').attr('href', href).text(text || href).attr('target', '_blank');
}

$(document).on('click', '.result-list .result-list-item', function(e) {  
  var $item = $(e.target);
  var index = parseInt($item.attr('data-gym-index'), 10) - 1;
  var content = generateGymInfo(gymList[index]);

  $modal.find('.modal-content').empty().append(content);
  $modal.show();
});

// https://stackoverflow.com/a/37893239
function convertDMS(lat, lng) {
  var latitude = toDegreesMinutesAndSeconds(lat);
  var latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";
  var longitude = toDegreesMinutesAndSeconds(lng);
  var longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";
  return latitude + " " + latitudeCardinal + "&nbsp;" + longitude + " " + longitudeCardinal;
}
function toDegreesMinutesAndSeconds(coordinate) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  return degrees + '&deg;' + minutes + '\'' + seconds + '"';
}

// https://stackoverflow.com/a/1140335
function parseDMS(input) {
  var parts = input.split(/[^\d\w]+/);
  var lat = convertDMSToDD(parts[0], parts[1], parts[2], parts[3]);
  var lng = convertDMSToDD(parts[4], parts[5], parts[6], parts[7]);
}
function convertDMSToDD(degrees, minutes, seconds, direction) {
  var dd = degrees + minutes / 60 + seconds / (60 * 60);
  if (direction == "S" || direction == "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}