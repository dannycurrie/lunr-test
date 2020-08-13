const lunr = require('lunr');

function initBuilder(options) {
  const builder = new lunr.Builder();
  builder.ref('id');
  options.fields.forEach(builder.field.bind(builder));
  return builder;
}

function createIndex(options, docs) {
  const builder = initBuilder(options);

  docs.map(doc => builder.add(doc));
  return builder.build();
}

function printResults(results, documents, fields) {
  console.log('results...');
  const docsMap = documents.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});
  return results.map(({ ref: id }) =>
    fields.map(
      f => console.log(`${f}: ${docsMap[id][f]}`)
    )
  );
}

module.exports = {
  createIndex,
  printResults
}