type Ok<T> = { ok: true; data: T };
type Err<T> = { ok: false; error: T };

export type Result<T, TError> = Ok<T> | Err<TError>;

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, data: value };
}

export function err<T>(value: T): Result<never, T> {
  return { ok: false, error: value };
}
