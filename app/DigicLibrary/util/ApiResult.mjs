import { Schema } from './Schema.mjs';

class ApiResult {
  constructor(status, response) {
    this.__status__ = status;
    this.__response__ = response;

    this.__minetypes__ = this.__response__.content
      ? Object.entries(this.__response__.content).map(([minetype, content]) => ({
          minetype: minetype,
          schemas: content.schema ? [new Schema(content.schema)] : [],
        }))
      : [];
  }

  isOk() {
    return this.__status__ >= 200 && this.__status__ < 300;
  }

  isErr() {
    return !this.isOk();
  }

  renderReturnBlock() {
    return `${this.isOk() ? 'ok' : 'err'}(${!this.__hasContent__() ? 'void 0' : !this.__hasSchema__() ? 'await response.text()' : 'await response.json()'})`;
  }

  getStatus() {
    return Number(this.__status__);
  }

  getSchemas() {
    return this.__hasSchema__() ? [this.__getSchema__()] : [];
  }

  getOkReturnTypes() {
    return this.isOk() ? [this.__getReturnType__()] : [];
  }

  getErrReturnTypes() {
    return this.isErr() ? [this.__getReturnType__()] : [];
  }

  __hasContent__() {
    return this.__minetypes__.length > 0;
  }

  __hasSchema__() {
    return this.__hasContent__() && this.__minetypes__[0].schemas.length > 0;
  }

  __getMinetype__() {
    return this.__minetypes__[0].minetype;
  }

  __getSchema__() {
    return this.__minetypes__[0].schemas[0];
  }

  __getReturnType__() {
    return !this.__hasContent__() ? 'void' : !this.__hasSchema__() ? 'string' : this.__getSchema__().getTypeName();
  }
}

export { ApiResult };
