export type RequestOptions = {
  data?: XMLHttpRequestBodyInit | Document;
  headers?: Record<string, string>;
  timeout?: number;
};

export const METHODS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
} as const;

export type HttpMethod = (typeof METHODS)[keyof typeof METHODS];
