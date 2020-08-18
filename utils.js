const { performance } = require('perf_hooks');
const faker = require('faker');

const MAX_TERM_LENGTH = 5;

function measure(fn, label) {
  const before = performance.now();
  const res = fn();
  const after = performance.now();
  console.log(`${label} - ${after - before}ms`);
  if (res)
    return res;
}

function getRandomSearchTerm() {
  const length = faker.random.number(MAX_TERM_LENGTH);
  return faker.random.words(length);
}

module.exports = {
  measure,
  getRandomSearchTerm
}