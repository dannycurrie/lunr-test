const lunr = require('lunr');
const testDocs = require('./test-docs');
const { printResults, createIndex } = require('./lunr-utils');
const { measure } = require('./utils');

const createFn = createIndex.bind(null,
  {
    fields: ['title'],
    pipeline: [
      lunr.trimmer,
      lunr.stopWordFilter,
      lunr.stemmer,
    ],
    searchPipeline: [
      lunr.stemmer,
    ]
  },
  testDocs
);
const index = measure(createFn, `building index for ${testDocs.length} documents`);

const performAndMeasureSearch = query => {
  const searchFn = index.search.bind(index, query);
  let results = measure(searchFn, `searching for term "${query}"`);
  printResults(results, testDocs, []);
}

console.log('--- SIMPLE SEARCH ---');
performAndMeasureSearch('neural');

console.log('--- WILDCARD SEARCH ---');
performAndMeasureSearch('neu*');

console.log('--- FUZZY SEARCH TIGHT ---');
performAndMeasureSearch('neural~1');

console.log('--- FUZZY SEARCH LOOSE ---');
performAndMeasureSearch('neural~3');
