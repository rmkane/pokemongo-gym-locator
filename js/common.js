function aggregateValues(obj, keys) {
  return keys.map(function(key) {
    return obj[key];
  }, []).join(' ').toLowerCase();
}
