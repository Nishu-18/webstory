import { Pinecone } from "@pinecone-database/pinecone";


const pc = new Pinecone({
  apiKey: 'pcsk_2BBhYM_UcYWxigvacEPJj11VsCM6bPGGLDNy3afyZB6S4m6kBsQ561PZE4i5Y17kguSvMs'
});

const indexName = 'developer-quickstart-js';
await pc.createIndexForModel({
  name: indexName,
  cloud: 'aws',
  region: 'us-east-1',
  embed: {
    model: 'llama-text-embed-v2',
    fieldMap: { text: 'chunk_text' },
  },
  waitUntilReady: true,
});