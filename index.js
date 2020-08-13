const testDocs = require('./test-docs');
const { printResults, createIndex } = require('./lunr-utils');
const { measure } = require('./utils');

const createFn = createIndex.bind(null, { fields: ['title'] }, testDocs);
const index = measure(createFn, `building index for ${testDocs.length} documents`);

const searchFn = index.search.bind(index, 'performance');
const results = measure(searchFn, 'searching...');

printResults(results, testDocs, ['title', 'source']);