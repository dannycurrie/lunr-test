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

function printField(doc, field) {
  const fieldVal = doc[field];
  if (fieldVal && typeof fieldVal === 'object')
    console.log(JSON.stringify(fieldVal));
  else
    console.log(`${field}: ${fieldVal}`);
}

function printResults(results, documents, fields = []) {
  console.log(`------ ${results.length} results ------`);
  if (fields.length) {
    const docsMap = documents.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});
    results.map(({ ref: id }) => {
      fields.map(
        field => printField(docsMap[id], field)
      )
      console.log('---');
    }
    );
  }
}

const sanitizeSearchInput = input => input.replace(/~|:|\^|\+|-/g, '');

module.exports = {
  measure,
  getRandomSearchTerm,
  printResults,
  sanitizeSearchInput,
}