import { generateClient, type Client } from "./client";
import { isErr, isOk } from "./helper";
import type { ApiResult } from "./types";

const CLIENT_CACHE = new Map<string, Client>();

const getEntrypoint = (): string => import.meta.env.PROD ? '' : 'http://localhost:5174';

const getClient = (): Client => {
  const entrypoint = getEntrypoint();
  if (!CLIENT_CACHE.has(entrypoint)) CLIENT_CACHE.set(entrypoint, generateClient(entrypoint));
  return CLIENT_CACHE.get(entrypoint)!;
};

export type { ApiResult };
export { isOk, isErr, getEntrypoint, getClient };
