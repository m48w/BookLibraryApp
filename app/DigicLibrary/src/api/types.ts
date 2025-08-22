// 型確定用定数
const API_RESULT_TYPE = {
  OK: 'API_RESULT_OK',
  ERR: 'API_RESULT_ERR',
} as const;

// 型定義
interface Ok<T> {
  readonly type: typeof API_RESULT_TYPE.OK;
  readonly value: T;
}

interface Err<E> {
  readonly type: typeof API_RESULT_TYPE.ERR;
  readonly value: E;
}

type ApiResult<T, E> = Ok<T> | Err<E>;

export { API_RESULT_TYPE };
export type { Ok, Err, ApiResult };
