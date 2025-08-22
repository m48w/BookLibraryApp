import { ApiResult } from './ApiResult.mjs';
import { Schema } from './Schema.mjs';

class Operation {
  constructor(path, method, operation) {
    this.__path__ = path;
    this.__method__ = method;
    this.__operation__ = operation;

    this.__parameters__ = operation.parameters
      ? operation.parameters.map((parameter) => ({
          ...parameter,
          schema: new Schema(parameter.schema),
        }))
      : [];
    this.__bodies__ = operation.requestBody
      ? [
          Object.entries(operation.requestBody.content).map(([minetype, content]) => ({
            minetype: minetype,
            schema: new Schema(content.schema),
          }))[0],
        ]
      : [];
    this.__results__ = operation.responses ? Object.entries(operation.responses).map(([status, response]) => new ApiResult(status, response)) : [];
    this.__responses__ = this.__results__
      .flatMap((result) => result.getSchemas())
      .map((schema) => ({
        schema: schema,
      }));
  }

  getControllerName() {
    return this.__operation__.tags[0];
  }

  getFunctionName() {
    return this.__operation__.operationId.slice(this.__operation__.operationId.indexOf('_') + 1);
  }

  generateClient() {
    return `const ${this.getFunctionName()} = (basePath: string) => async (${[...this.__renderArguments__()].join(`, `)}):
Promise<ApiResult<${this.__getOkReturnTypes__().join(` | `)}, ${this.__getErrReturnTypes__().join(` | `)}>> =>
{
  try {
    const response = await fetch(
      ${[`basePath`, ...this.__renderPaths__(), ...this.__renderQueryStrings__()].join(` + `)},
      { ${[...this.__renderMethods__(), ...this.__renderHeaders__(), ...this.__renderBodies__()].join(` `)} }
    );
    try {
${this.__results__
  .map(
    (result) => `
      if (response.status === ${result.getStatus()}) {
        return ${result.renderReturnBlock()};
      }`
  )
  .join(``)}
      return err({ messages: ['Response has invalid status code.'] });
    }
    catch (error) {
      return err({ messages: ['Unknown application error has occured.'] });
    }
  }
  catch (error) {
    return err({ messages: ['Network error has occured.'] });
  }
}
`;
  }

  getReferences() {
    return [...new Set(this.__resolveReferences__())];
  }

  __renderPaths__() {
    return [`\`${this.__path__.replace('{', '${')}\``];
  }

  __renderQueryStrings__() {
    return this.__parameters__.some((param) => param.in === 'query')
      ? [
          `'?'`,
          `new URLSearchParams({ ${this.__parameters__
            .filter((param) => param.in === 'query')
            .map((param) => `${param.name}: String(${param.name} ?? ''),`)
            .join(``)} }).toString()`,
        ]
      : [];
  }

  __getOkReturnTypes__() {
    return [...new Set(this.__results__.flatMap((res) => res.getOkReturnTypes()))];
  }

  __getErrReturnTypes__() {
    return [...new Set(this.__results__.flatMap((res) => res.getErrReturnTypes()))];
  }

  __renderParamArguments__() {
    return this.__parameters__.map((param) => `${param.name + (param.required ? '' : '?')}: ${param.schema.getTypeName()}`);
  }

  __renderBodyArguments__() {
    return this.__bodies__.map((body) => `body: ${body.schema.getTypeName()}`);
  }

  __renderArguments__() {
    return [...this.__renderParamArguments__(), ...this.__renderBodyArguments__()];
  }

  __renderMethods__() {
    return [`method: '${this.__method__.toUpperCase()}',`];
  }

  __renderHeaders__() {
    return this.__bodies__.filter((body) => !body.minetype.includes('form-data')).map((body) => `headers: { 'Content-Type': '${body.minetype}', },`);
  }

  __renderBodies__() {
    return this.__bodies__.map((body) => `body: ${body.minetype.includes('json') ? 'JSON.stringify(body)' : body.minetype.includes('form-data') ? 'toFormData(body)' : 'body'},`);
  }

  __resolveReferences__() {
    return [...this.__parameters__, ...this.__bodies__, ...this.__responses__].flatMap((content) => content.schema.getReferences());
  }
}

export { Operation };
