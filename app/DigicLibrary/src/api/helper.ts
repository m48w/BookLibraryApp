import { API_RESULT_TYPE, type ApiResult, type Err, type Ok } from "./types";

// コンストラクタ
const ok = <T, E>(value: T): ApiResult<T, E> => ({
  type: API_RESULT_TYPE.OK,
  value: value,
});

const err = <T, E>(value: E): ApiResult<T, E> => ({
  type: API_RESULT_TYPE.ERR,
  value: value,
});

// Type Guard
const isOk = <T, E>(result: ApiResult<T, E>): result is Ok<T> =>
  result.type === API_RESULT_TYPE.OK;

const isErr = <T, E>(result: ApiResult<T, E>): result is Err<E> =>
  result.type === API_RESULT_TYPE.ERR;

// serialize to FormData
const toFormData = (body: Record<string, unknown>): FormData => {
  const formData = new FormData();
  const records = Object.entries(body)
    .flatMap(([key, value]) => Array.isArray(value) ? value.map((item: unknown) => ({ key: key, value: item })) : { key: key, value: value });
  for (const record of records) {
    if (record.value instanceof Blob) {
      formData.append(record.key, record.value, record.value instanceof File ? record.value.name : undefined);
    }
    else if (typeof record.value === 'string') {
      formData.append(record.key, record.value);
    }
    else {
      formData.append(record.key, String(record.value));
    }
  }
  return formData;
};

export { ok, err, isOk, isErr, toFormData };
