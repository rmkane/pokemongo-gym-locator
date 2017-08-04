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
