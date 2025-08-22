import { exit, argv } from 'process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';

import { Schema } from './Schema.mjs';

const main = async () => {
  if (argv.length < 4) {
    console.log('USAGE: node oas2model.js [spec_url] [out_path]');
    exit(-1);
  }
  const specUrl = argv[2];
  const outPath = argv[3];

  try {
    const api = await SwaggerParser.parse(specUrl);
    const schemas = api.components.schemas;

    for (const schemaName in schemas) {
      const schema = new Schema(schemas[schemaName]);
      const references = schema.getReferences();

      let result = ``;

      if (references.length > 0) {
        result += references
          .sort()
          .map((name) => `import { ${name} } from './${name}';\n`)
          .join(``);
        result += `\n`;
      }

      if (schema.isObject()) {
        result += `export interface ${schemaName} ${schema.getTypeName()}\n`;
      } else if (schema.isEnum()) {
        result += `export type ${schemaName} = ${schema.getTypeName()};\n`;
      }

      const schemaFileName = resolve(outPath, `${schemaName}.ts`);
      console.log('[WRITE]', schemaFileName);
      writeFileSync(schemaFileName, result, 'utf8');
    }
  } catch (err) {
    console.log('Failed to scaffold from OAS: ', err);
    exit(-1);
  }
};

// node eas2model.js [spec_url] [out_path]
main();
