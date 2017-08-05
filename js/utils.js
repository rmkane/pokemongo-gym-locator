/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * (Math.PI / 180);
  }
}
if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * (180 / Math.PI);
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

function formatMiles(number) {
  suffix = ' miles';
  if (number < 0.05) {
    number *= 5280;
    suffix = ' feet';
  }
  if (number < 0.5) {
    number *= 1760;
    suffix = ' yards';
  }
  return number.toFixed(2) + suffix;
}

function kilometersToMiles(km) {
  return 0.62137119 * km;
}

/** @unused - https://gist.github.com/basarat/4670200 */
// Given "0 - 360" returns the nearest cardinal direction "N/NE/E/SE/S/SW/W/NW/N" 
function getCardinal(angle) {
  // Easy to customize by changing the number of directions you have 
  var directions = 8;
  var degree = 360 / directions;
  angle = angle + degree / 2;
  if (angle >= 0 * degree && angle < 1 * degree) return "N";
  if (angle >= 1 * degree && angle < 2 * degree) return "NE";
  if (angle >= 2 * degree && angle < 3 * degree) return "E";
  if (angle >= 3 * degree && angle < 4 * degree) return "SE";
  if (angle >= 4 * degree && angle < 5 * degree) return "S";
  if (angle >= 5 * degree && angle < 6 * degree) return "SW";
  if (angle >= 6 * degree && angle < 7 * degree) return "W";
  if (angle >= 7 * degree && angle < 8 * degree) return "NW";
  return "N"; // Should never happen: 
}

/** http://climate.umn.edu/snow_fence/components/winddirectionanddegreeswithouttable3.htm */
function getCardinalInner(angle, directions) {
  var degree = 360 / directions.length;
  var slice = Math.floor((angle + degree / 2) / degree) % directions.length;
  return directions[slice];
}
function getCardinal2(angle) {
  var directions = [ 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW' ];
  return getCardinalInner(angle, directions);
}
function getCardinal3(angle) {
  var directions = [ 'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW' ];
  return getCardinalInner(angle, directions);
}

function getArrow(angle) {
  var directions = 8;
  var degree = 360 / directions;
  var slice = Math.floor((angle + degree / 2) / degree) % directions;
  
  var deg2 = slice * degree;
  
  return $('<i>').addClass('fa fa-long-arrow-up fa-rotate-' + deg2 + ' cardinal-direction-arrow');
}

var MAX_GYM_COUNT = 10;
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
      .append($('<span>').addClass('gym-info-section-title').text('Notes'))
      .append($('<span>').text(gym.notes.length > 0 ? gym.notes : 'N/A')));
    
    if (gyms && gyms.length > 0) {
      var $gyms = (gyms || []).reduce(function(list, otherGym) {
        var distanceKm = computeDistance(gym.latitude, gym.longitude, otherGym.latitude, otherGym.longitude);
        var angleDeg = computeAngle(gym.latitude, gym.longitude, otherGym.latitude, otherGym.longitude);
        if (gym != otherGym) {
          list.push({
            name : otherGym.name,
            distance : distanceKm,
            angle : angleDeg
          });
        }
        return list;
      }, []).sort(function(a, b) {
        return a.distance - b.distance;
      });
      
      var minCount = Math.min($gyms.length, MAX_GYM_COUNT);
      var distanceOfLast = $gyms[minCount - 1].distance;
      var frmtDistance = '~ ' + formatDistance(roundToNearestDigit(distanceOfLast));

      $gyms = $gyms.slice(0, minCount).map(renderGymDistanceInfo);
    
      $result.append($('<p>').addClass('gym-info-section')
        .append($('<span>').addClass('gym-info-section-title').text('Gyms Nearby'))
        .append($('<span>').addClass('gym-info-section-subtitle').text(frmtDistance))
        .append($gyms));
    }
    
    return $result;
}

function formatDistance(distanceKm) {
  var frmtKm = abbreviateNumber(distanceKm) + 'm';
  var frmtMi = formatMiles(kilometersToMiles(distanceKm / 1e3));
  
  return frmtKm + ' / ' + frmtMi;
}

function renderGymDistanceInfo(gymInfo) {
  var frmtDist = formatDistance(gymInfo.distance);
  var frmtDir = getCardinal3(gymInfo.angle);
  var $arrow = getArrow(gymInfo.angle);
  
  var $a = $('<a>').attr('href', '../gym/' + gymInfo.name.replace(/\s+/g, '_')).text(gymInfo.name);
  
  var $span = $('<span>').html(frmtDist + ' &mdash; ' + frmtDir).addClass('nearby-bearing');

  return $('<p>').append($a).append(' &mdash; ').append($span).append($arrow);
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
  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad1)   * Math.cos(rad2) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/** https://stackoverflow.com/questions/8502795 */
function computeAngle(lat1, lon1, lat2, lon2) {
  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  lat1 = lat1.toRad();
  lat2 = lat2.toRad();
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = Math.atan2(y, x).toDeg();
  // Fix negative degrees
  if (brng < 0) {
      brng = 360 - Math.abs(brng);
  }

  return brng;
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
