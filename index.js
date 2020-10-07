const { performance } = require('perf_hooks');
const lunr = require('lunr');
const testDocs = require('./test-docs');
const { createIndex } = require('./lunr-utils');
const { getRandomSearchTerm, measure, printResults, sanitizeSearchInput } = require('./utils');

const createFn = createIndex.bind(null,
  {
    fields: ['title', 'identifiers'],
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

const performAndMeasureSearch = (query, fields = []) => {
  const searchFn = index.search.bind(index, query);
  let results = measure(searchFn, `searching for term "${query}"`);
  printResults(results, testDocs, fields);
}

const basicTest = () => {
  console.log('--- SIMPLE SEARCH ---');
  performAndMeasureSearch('neural');

  console.log('--- WILDCARD SEARCH ---');
  performAndMeasureSearch('neu*');

  console.log('--- FUZZY SEARCH TIGHT (one edit distance) ---');
  performAndMeasureSearch('neural~1');

  console.log('--- FUZZY SEARCH LOOSE (three edit distance) ---');
  performAndMeasureSearch('neural~3');
}

const randomTest = () => {
  const times = Math.trunc(Math.random() * 1000);

  let searchTime = 0;

  for (let i = 0; i <= times; i++) {
    const before = performance.now();
    index.search(getRandomSearchTerm());
    const after = performance.now();
    searchTime += after - before;
  }

  console.log('---- SIMPLE RANDOM SEARCH ----');
  console.log(`${times} searches - average time: ${searchTime / times}ms`)
}

const search = term => performAndMeasureSearch(sanitizeSearchInput(term), ['title', 'identifiers']);

const args = process.argv.slice(2);

if (args.length) {
  const arg = args[0];

  if (arg === 'random')
    randomTest();
  else
    // concat args as a search term
    search(args.join(' '))
} else
  basicTest();