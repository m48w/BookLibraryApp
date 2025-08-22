import { exit, argv } from 'process';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';

import { Operation } from './Operation.mjs';

const getControllers = (paths) =>
  Object.entries(paths)
    .flatMap(([path, pathItem]) => Object.entries(pathItem).map(([method, operation]) => new Operation(path, method, operation)))
    .reduce((controllers, operation) => {
      if (controllers[operation.getControllerName()]) {
        controllers[operation.getControllerName()].push(operation);
      } else {
        controllers[operation.getControllerName()] = [operation];
      }
      return controllers;
    }, {});

// import
const getControllerReferences = (operations) => [...new Set(operations.flatMap((operation) => operation.getReferences()))].sort();

// メインロジック
const main = async () => {
  // 引数を展開
  if (argv.length < 4) {
    console.log('USAGE: node eas2api.js [spec_url] [out_path]');
    exit(-1);
  }
  const specUrl = argv[2];
  const outPath = argv[3];

  // パースして、タグ毎に仕分けて出力する
  try {
    const api = await SwaggerParser.parse(specUrl);
    const paths = api.paths;
    const controllers = getControllers(paths);

    let result = ``;
    result += `import { ApiResult } from './types';\n`;
    result += `import { ok, err, toFormData } from './helper';\n`;

    // import all references in controller
    result += getControllerReferences(
      Object.values(controllers).flatMap((operations) => operations)
    )
      .map((name) => `import { ${name} } from './models/${name}';\n`)
      .join(``);

    result += '\n';

    result += (
      Object.values(controllers).flatMap((operations) => operations)
    )
      .flatMap((operation) => `${operation.generateClient()}\n`)
      .join('');

    result += '\n';

    result += 'const generateClient = (basePath: string) => ({\n';
    result += (
      Object.values(controllers).flatMap((operations) => operations)
    )
      .flatMap((operation) => `  ${operation.getFunctionName()}: ${operation.getFunctionName()}(basePath),\n`)
      .join('');
    result += '});\n';

    result += '\n';

    result += 'type Client = ReturnType<typeof generateClient>;\n';

    result += '\n';

    result += 'export { generateClient };\n';
    result += 'export type { Client };\n';

    // 書き込み
    const controllerFileName = resolve(outPath, `client.ts`);
    console.log('[WRITE]', controllerFileName);
    writeFileSync(controllerFileName, result, 'utf8');
  } catch (err) {
    console.log('Failed to scaffold from OAS: ', err);
    exit(-1);
  }
};

// node eas2api.js [spec_url] [out_path]
main();
