function generateGymInfo(gym, photoSizeClass) {
  return $('<div>').addClass('gym-info')
    .append($('<h1>').text(gym.name))
    .append($('<p>').html(gym.street + '<br>' + gym.city + ', ' + gym.state + ' ' + gym.zip))
    .append($('<p>').addClass('photo-disc ' + (photoSizeClass || ''))
      .append($('<div>').addClass('photo-disc-inner').css('background-image', 'url("' + gym.image + '")')))
    .append($('<p>').html(convertDMS(gym.latitude, gym.longitude)))
    .append($('<p>')
      .append(createLink('https://gymhuntr.com/#', function(data) {
        return data.latitude + ',' + data.longitude;
      }, gym, 'Gymhuntr'))
      .append(createLink('http://maps.google.com/?layer=t&saddr=Current+Location&daddr=', function(data) {
        return [ data.street, data.city, data.state, data.zip ].join(' ');
      }, gym, 'Directions')))
    .append($('<p>').addClass('gym-info-notes')
      .append($('<label>').text('Notes'))
      .append($('<span>').text(gym.notes.length > 0 ? gym.notes : 'N/A')));
}

function createLink(url, fn, data, text) {
  var href = url + fn(data);
  return $('<a>').addClass('external-link').attr('href', href).text(text || href).attr('target', '_blank');
}

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
