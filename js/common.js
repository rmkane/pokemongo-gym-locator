/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10 */
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};

(function() {
  $.errorMessage = function(message) {
    return $('<p>').addClass('missing-query').html(message);
  }
})(jQuery);

function replaceSpaces(str) {
  return str.replace(/\s+/g, '_');
}

function replaceUnderscore(str) {
  if (str.indexOf('_') > -1) {
    return str.replace(/[_]+/g, ' ');
  }
  return str;
}

function aggregateValues(obj, keys) {
  return keys.map(function(key) {
    return obj[key];
  }, []).join(' ').toLowerCase();
}

// https://stackoverflow.com/questions/5731193/how-to-format-numbers-using-javascript
function formatThousandsWithRounding(n, dp) {
  var w = n.toFixed(dp), k = w|0, b = n < 0 ? 1 : 0,
      u = Math.abs(w-k), d = (''+u.toFixed(dp)).substr(2, dp),
      s = ''+k, i = s.length, r = '';
  while ( (i-=3) > b ) { r = ',' + s.substr(i, 3) + r; }
  return s.substr(0, i + 3) + r + (d ? '.'+d: '');
}
var formatThousandsNoRounding = function(n, dp) {
  var e = '', s = e+n, l = s.length, b = n < 0 ? 1 : 0,
      i = s.lastIndexOf('.'), j = i == -1 ? l : i,
      r = e, d = s.substr(j+1, dp);
  while ( (j-=3) > b ) { r = ',' + s.substr(j, 3) + r; }
  return s.substr(0, j + 3) + r + 
    (dp ? '.' + d + ( d.length < dp ? 
        ('00000').substr(0, dp - d.length):e):e);
}

/** https://ubuntuforums.org/showthread.php?t=816175 */
function pow10floor(x) {
  return  Math.pow(10, Math.floor(Math.log10(x)));
}
function pow10round(x) {
  return Math.pow(10, Math.floor(Math.log10(x) + 0.5));
}
function roundToNearestDigit(number) {
  var factor = number < 10 ? 0 : Math.ceil(Math.log10(number)) - 1;
  var multiplier = Math.pow(10, factor - 1);
  return Math.ceil(Math.ceil(number / multiplier) * multiplier);
}
