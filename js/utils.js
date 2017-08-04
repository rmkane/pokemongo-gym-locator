/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// https://stackoverflow.com/a/40724354
var SI_PREFIXES = ["", "k", "M", "G", "T", "P", "E"];
function abbreviateNumber(number, precision) {
  // what tier? (determines SI prefix)
  var tier = Math.log10(number) / 3 | 0;
  // if zero, we don't need a prefix
  if(tier == 0) return number.toFixed(precision || 2);
  // get prefix and determine scale
  var prefix = SI_PREFIXES[tier];
  var scale = Math.pow(10, tier * 3);
  // scale the number
  var scaled = number / scale;
  // format number and add prefix as suffix
  return scaled.toFixed(precision || 2) + prefix;
}

function kilometersToMiles(km) {
  return 0.62137119 * km;
}

function generateGymInfo(gym, gyms, photoSizeClass) {
  var $result = $('<div>').addClass('gym-info')
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
    .append($('<p>').addClass('gym-info-section')
      .append($('<label>').text('Notes'))
      .append($('<span>').text(gym.notes.length > 0 ? gym.notes : 'N/A')));
    
    if (gyms && gyms.length > 0) {
      $result.append($('<p>').addClass('gym-info-section')
      .append($('<label>').text('Gyms Nearby'))
      .append((gyms || []).reduce(function(list, otherGym) {
        var distanceKm = computeDistance(gym.latitude, gym.longitude, otherGym.latitude, otherGym.longitude);
        if (gym != otherGym && distanceKm <= 2000) {
          list.push({
            name : otherGym.name,
            distance : distanceKm
          });
        }
        return list;
      }, []).sort(function(a, b) {
        return a.distance - b.distance;
      }).map(function(gymInfo) {
      var frmtKm = abbreviateNumber(gymInfo.distance) + 'm';
      var frmtMi = kilometersToMiles(gymInfo.distance / 1e3).toFixed(2) + 'miles';
      
      var $a = $('<a>').attr('href', 'gym.html?' + $.param({
        name : gymInfo.name.replace(/\s+/g, '_')
      })).text(gymInfo.name);

      return $('<p>').append($a).append(' &mdash; ' + frmtKm + ' / ' + frmtMi);
    })));
    }
    
    return $result;
}

function createLink(url, fn, data, text) {
  var href = url + fn(data);
  return $('<a>').addClass('external-link').attr('href', href).text(text || href).attr('target', '_blank');
}

/** http://www.movable-type.co.uk/scripts/latlong.html */
function computeDistance(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // metres
  var rad1 = lat1.toRad();
  var rad2 = lat2.toRad();
  var deltaLat = (lat2 - lat1).toRad();
  var deltaLon = (lon2 - lon1).toRad();
  var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
          Math.cos(rad1)       * Math.cos(rad2) *
          Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/** https://stackoverflow.com/a/37893239 */
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

/** https://stackoverflow.com/a/1140335 */
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
