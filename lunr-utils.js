const lunr = require('lunr');

function initBuilder(options) {
  const builder = new lunr.Builder();
  builder.ref('id');

  if (options.pipeline) {
    builder.pipeline.add(
      ...options.pipeline
    );
  }

  if (options.searchPipeline) {
    builder.searchPipeline.add(
      ...options.searchPipeline
    );
  }
  options.fields.forEach(builder.field.bind(builder));
  return builder;
}

function createIndex(options, docs) {
  const builder = initBuilder(options);

  docs.map(doc => builder.add(doc));
  return builder.build();
}

function printResults(results, documents, fields = []) {
  console.log(`------ ${results.length} results ------`);
  if (fields.length) {
    const docsMap = documents.reduce((acc, doc) => ({ ...acc, [doc.id]: doc }), {});
    results.map(({ ref: id }) =>
      fields.map(
        field => console.log(`${field}: ${docsMap[id][field]}`)
      )
    );
  }
}

module.exports = {
  createIndex,
  printResults
}