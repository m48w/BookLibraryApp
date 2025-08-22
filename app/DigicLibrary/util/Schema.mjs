const decodeUnicodeEscape = (val) => decodeURIComponent(JSON.parse(`"${val}"`));

class Schema {
  constructor(schema) {
    this.__schema__ = schema || {};

    this.__required__ = 'required' in schema ? schema.required : [];
    this.__items__ = 'items' in schema ? [new Schema(schema.items)] : [];
    this.__properties__ = 'properties' in schema
      ? (
        Object.entries(schema.properties)
          .map(([name, prop]) => [name, {
            ...prop,
            nullable: prop.nullable ?? !this.__required__.some(required => required === name),
          }])
          .map(([name, prop]) => [name, new Schema(prop)])
      )
      : [];
    this.__additionalProperties__ = 'additionalProperties' in schema && schema.additionalProperties !== false ? [new Schema(schema.additionalProperties)] : [];
  }

  isReference() {
    return '$ref' in this.__schema__;
  }

  isEnum() {
    return 'enum' in this.__schema__;
  }

  isArray() {
    return this.__schema__.type === 'array';
  }

  isObject() {
    return this.__schema__.type === 'object';
  }

  isString() {
    return this.__schema__.type === 'string';
  }

  getNullable() {
    return this.__schema__.nullable === true ? '?' : '';
  }

  getTypeName() {
    // reference
    if (this.isReference()) {
      return this.__parseReference__();
    }
    // enum
    else if (this.isEnum()) {
      return this.__parseEnum__();
    }
    // array
    else if (this.isArray()) {
      return this.__parseArray__();
    }
    // object
    else if (this.isObject()) {
      return this.__parseObject__();
    }
    // string
    else if (this.isString()) {
      return this.__parseString__();
    }
    // primitive
    else if ('type' in this.__schema__) {
      return this.__parsePrimitive__();
    }
    return 'unknown';
  }

  getReferences() {
    if (this.isReference()) {
      return [this.getTypeName()];
    }
    return [...new Set(this.__resolveReferences__())];
  }

  __parseReference__() {
    return this.__schema__.$ref.split('/').slice(-1)[0];
  }

  __parseEnum__() {
    return this.__schema__.enum.map((value) => `'${decodeUnicodeEscape(value)}'`).join(` | `);
  }

  __parseArray__() {
    return this.__items__.map((schema) => `Array<${schema.getTypeName()}>`).join(``) || `Array<unknown>`;
  }

  __parseProperties__() {
    return this.__properties__.map(([name, schema]) => `${name + schema.getNullable()}: ${schema.getTypeName()};`);
  }

  __parseAdditionalProperties__() {
    return this.__additionalProperties__.map((schema) => `[key: string]: ${schema.getTypeName()};`);
  }

  __parseObject__() {
    return `{ ${[...this.__parseProperties__(), ...this.__parseAdditionalProperties__()].join(' ')} }`;
  }

  __parseString__() {
    return this.__schema__.format === 'binary' ? 'Blob' : this.__schema__.type;
  }

  __parsePrimitive__() {
    return this.__schema__.type === 'integer' ? 'number' : this.__schema__.type;
  }

  __resolveArray__() {
    return this.__items__.flatMap((schema) => schema.getReferences());
  }

  __resolveProperties__() {
    return this.__properties__.flatMap(([name, schema]) => schema.getReferences());
  }

  __resolveAdditionalProperties__() {
    return this.__additionalProperties__.flatMap((schema) => schema.getReferences());
  }

  __resolveReferences__() {
    return [...this.__resolveArray__(), ...this.__resolveProperties__(), ...this.__resolveAdditionalProperties__()];
  }
}

export { Schema };
