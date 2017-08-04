/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10 */
Math.log10 = Math.log10 || function(x) {
  return Math.log(x) * Math.LOG10E;
};

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