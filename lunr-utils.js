const lunr = require('lunr');
const { sanitizeSearchInput } = require('./utils');

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

  options.fields.forEach(field => {
    builder.field(field);
  });

  return builder;
}

function concatIdentifiers(identifiers) {
  if (identifiers) {
    return sanitizeSearchInput(
      Object.values(identifiers).join(' ')
    );
  }
  return '';
}

function processDocument(document) {
  return {
    ...document,
    identifiers: concatIdentifiers(document.identifiers)
  }
}

function createIndex(options, docs) {
  const builder = initBuilder(options);
  docs.map(doc => builder.add(processDocument(doc)));
  return builder.build();
}

module.exports = {
  createIndex,
}