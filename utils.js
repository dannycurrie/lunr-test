function measure(fn, label) {
  console.time(label);
  const res = fn();
  console.timeEnd(label);
  if (res)
    return res;
}

module.exports = {
  measure
}